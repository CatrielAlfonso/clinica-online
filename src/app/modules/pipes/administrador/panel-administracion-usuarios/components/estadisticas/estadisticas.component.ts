import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SupabaseDataService } from '../../../../../../services/supabase-data.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../../services/auth.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss',
  standalone: false,
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  supabaseDataService = inject(SupabaseDataService);
  authService = inject(AuthService);

  chartTurnosPorEspecialidad: any;
  chartTurnosPorDia: any;
  chartTurnosPorMedicoEnLapso: any;
  chartTurnosFinalizadosPorMedicoEnLapso: any;
  chartIngresosHoy: any;
  subscripciones: Subscription;

  usuariosObtenidos: any[];
  turnosObtenidos: any[];
  ingresosObtenidos: any[];

  constructor() 
  {
    Chart.register(...registerables);
    this.subscripciones = new Subscription();
    this.usuariosObtenidos = [];
    this.turnosObtenidos = [];
    this.ingresosObtenidos = [];
    this.RealizarLecturas();
  }

  ngOnInit(): void 
  { 
    setTimeout(() => { 
      
        this.CargarGraficos();
      
    }, 1500); 
  }

  ngOnDestroy(): void {
    this.subscripciones.unsubscribe();
  }

  async RealizarLecturas(): Promise<void> {
    try {
      const [usuarios, turnos, ingresos] = await Promise.all([
        this.authService.obtenerContenido("usuarios"),
        this.authService.obtenerContenido("turnos"),
        this.authService.obtenerContenido("ingresos")
      ]);

      this.usuariosObtenidos = usuarios;
      this.turnosObtenidos = turnos;

      const fechaHoy = new Date().toLocaleDateString('es-AR');
      this.ingresosObtenidos = ingresos.filter(i => i.fecha === fechaHoy);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  // onCaptchaResuelto(resuelto: boolean): void {
  //   //his.captchaResuelto = resuelto;
  //   if (resuelto) {
  //     this.CargarGraficos();
  //   }
  // }

  toggleCaptcha(): void {
    //this.captchaHabilitado = !this.captchaHabilitado;
    //this.captchaResuelto = false;
    this.DestruirGraficos();
  }

  CargarGraficos(): void
  {
    this.CargarGraficoIngresosHoy();
    this.CargarGraficoTurnosPorEspecialidad();
    this.CargarGraficoTurnosPorDia();
    this.CargarGraficoTurnosSolicitadosEnLapso();
    this.CargarGraficoTurnosFinalizadosEnLapso();
  }

  DestruirGraficos(): void {
    if (this.chartIngresosHoy) this.chartIngresosHoy.destroy();
    if (this.chartTurnosPorEspecialidad) this.chartTurnosPorEspecialidad.destroy();
    if (this.chartTurnosPorDia) this.chartTurnosPorDia.destroy();
    if (this.chartTurnosPorMedicoEnLapso) this.chartTurnosPorMedicoEnLapso.destroy();
    if (this.chartTurnosFinalizadosPorMedicoEnLapso) this.chartTurnosFinalizadosPorMedicoEnLapso.destroy();
  }

  CargarGraficoIngresosHoy(): void
  {
    // Contar ingresos por usuario
    let estadisticas: any = {};
    
    for(const ingreso of this.ingresosObtenidos)
    {
      const usuario = ingreso.usuario;
      if(estadisticas[usuario] != null) { 
        estadisticas[usuario] = estadisticas[usuario] + 1; 
      }
      else { 
        estadisticas[usuario] = 1; 
      }
    }

    const ctx = document.getElementById('chart-ingresos-hoy') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartIngresosHoy) {
      this.chartIngresosHoy.destroy();
    }

    // Generar colores dinámicos
    const colores = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56'
    ];

    this.chartIngresosHoy = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de ingresos',
            data: Object.values(estadisticas),
            backgroundColor: colores.slice(0, Object.keys(estadisticas).length),
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            position: 'right',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} ingreso(s) (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  CargarGraficoTurnosPorEspecialidad(): void
  {
    let estadisticas: any = {};

    for(const turno of this.turnosObtenidos)
    {
      for(const usuario of this.usuariosObtenidos)
      {
        if(turno.dniEspecialista == usuario.dni)
        {
          // Soporte para array de especialidades y string único
          const especialidades = Array.isArray(usuario.especialidades) 
            ? usuario.especialidades 
            : (usuario.especialidad ? [usuario.especialidad] : []);
          
          for(const especialidad of especialidades)
          {
            if(estadisticas[especialidad] != null) { 
              estadisticas[especialidad] = estadisticas[especialidad] + 1; 
            }
            else { 
              estadisticas[especialidad] = 1; 
            }
          }
        }
      }
    }

    const ctx = document.getElementById('chart-turnos-por-especialidad') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartTurnosPorEspecialidad) {
      this.chartTurnosPorEspecialidad.destroy();
    }

    this.chartTurnosPorEspecialidad = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(estadisticas),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  CargarGraficoTurnosPorDia(): void
  {
    let estadisticas: any = {};

    for(const turno of this.turnosObtenidos)
    {
      const fecha = turno.fecha.split(" ")[0];
      if(estadisticas[fecha] != null) { 
        estadisticas[fecha] = estadisticas[fecha] + 1; 
      }
      else { 
        estadisticas[fecha] = 1; 
      }
    }

    const ctx = document.getElementById('chart-turnos-por-dia') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartTurnosPorDia) {
      this.chartTurnosPorDia.destroy();
    }

    this.chartTurnosPorDia = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos dados',
            data: Object.values(estadisticas),
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  CargarGraficoTurnosSolicitadosEnLapso(): void
  {
    let estadisticas: any = {};
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);

    for(const turno of this.turnosObtenidos)
    {
      for(const usuario of this.usuariosObtenidos)
      {
        if(turno.dniEspecialista == usuario.dni && turno.fecha)
        {
          const fechaSeparada: string = turno.fecha.split(" ")[1] || turno.fecha.split(" ")[0];
          const partes = fechaSeparada.split("/");
          const fechaFormateada: string = `${partes[2]}-${partes[1]}-${partes[0]}`;
          const fechaParseada = new Date(fechaFormateada);

          if(fechaParseada >= fechaActual && fechaParseada <= fechaLimite)
          {
            const nombreCompleto = `${usuario.nombre} ${usuario.apellido || ''}`.trim();
            if(estadisticas[nombreCompleto] != null) { 
              estadisticas[nombreCompleto] = estadisticas[nombreCompleto] + 1; 
            }
            else { 
              estadisticas[nombreCompleto] = 1; 
            }
          }
        }
      }
    }

    const ctx = document.getElementById('chart-turnos-solicitados-lapso') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartTurnosPorMedicoEnLapso) {
      this.chartTurnosPorMedicoEnLapso.destroy();
    }

    this.chartTurnosPorMedicoEnLapso = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos solicitados',
            data: Object.values(estadisticas),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  CargarGraficoTurnosFinalizadosEnLapso(): void
  {
    let estadisticas: any = {};
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);

    for(const turno of this.turnosObtenidos)
    {
      for(const usuario of this.usuariosObtenidos)
      {
        if(turno.dniEspecialista == usuario.dni && turno.fecha && turno.estado == "Finalizado")
        {
          const fechaSeparada: string = turno.fecha.split(" ")[1] || turno.fecha.split(" ")[0];
          const partes = fechaSeparada.split("/");
          const fechaFormateada: string = `${partes[2]}-${partes[1]}-${partes[0]}`;
          const fechaParseada = new Date(fechaFormateada);

          if(fechaParseada >= fechaActual && fechaParseada <= fechaLimite)
          {
            const nombreCompleto = `${usuario.nombre} ${usuario.apellido || ''}`.trim();
            if(estadisticas[nombreCompleto] != null) { 
              estadisticas[nombreCompleto] = estadisticas[nombreCompleto] + 1; 
            }
            else { 
              estadisticas[nombreCompleto] = 1; 
            }
          }
        }
      }
    }

    const ctx = document.getElementById('chart-turnos-finalizados-lapso') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartTurnosFinalizadosPorMedicoEnLapso) {
      this.chartTurnosFinalizadosPorMedicoEnLapso.destroy();
    }

    this.chartTurnosFinalizadosPorMedicoEnLapso = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos finalizados',
            data: Object.values(estadisticas),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  DescargarPDF() 
  {
    let canvasIngresosHoy: any = document.querySelector('#chart-ingresos-hoy');
    let canvasTurnosPorEspecialidad: any = document.querySelector('#chart-turnos-por-especialidad');
    let canvasTurnosPorDia: any = document.querySelector('#chart-turnos-por-dia');
    let canvasTurnosSolicitadosEnLapso: any = document.querySelector('#chart-turnos-solicitados-lapso');
    let canvasTurnosFinalizadosEnLapso: any = document.querySelector('#chart-turnos-finalizados-lapso');
    
    let canvasIngresosHoyImg = canvasIngresosHoy.toDataURL("image/PNG", 1.0);
    let canvasTurnosPorEspecialidadImg = canvasTurnosPorEspecialidad.toDataURL("image/PNG", 1.0);
    let canvasTurnosPorDiaImg = canvasTurnosPorDia.toDataURL("image/PNG", 1.0);
    let canvasTurnosSolicitadosEnLapsoImg = canvasTurnosSolicitadosEnLapso.toDataURL("image/PNG", 1.0);
    let canvasTurnosFinalizadosEnLapsoImg = canvasTurnosFinalizadosEnLapso.toDataURL("image/PNG", 1.0);
    
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Ingresos de usuarios hoy", 5, 15);
    doc.addImage(canvasIngresosHoyImg, 'PNG', 10, 20, 280, 150);
    
    doc.addPage();
    doc.text("Gráfico de barras - Turnos por especialidad", 5, 15);
    doc.addImage(canvasTurnosPorEspecialidadImg, 'PNG', 10, 20, 280, 150);
    
    doc.addPage();
    doc.text("Gráfico de líneas - Turnos por día", 5, 15);
    doc.addImage(canvasTurnosPorDiaImg, 'PNG', 10, 20, 280, 150);
    
    doc.addPage();
    doc.text("Gráfico de torta - Turnos solicitados (15 días)", 5, 15);
    doc.addImage(canvasTurnosSolicitadosEnLapsoImg, 'PNG', 10, 20, 280, 150);
    
    doc.addPage();
    doc.text("Gráfico de dona - Turnos finalizados (15 días)", 5, 15);
    doc.addImage(canvasTurnosFinalizadosEnLapsoImg, 'PNG', 10, 20, 280, 150);
    
    doc.save('estadisticas-clinica.pdf');
  }
}