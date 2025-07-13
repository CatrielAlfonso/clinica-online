import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SupabaseDataService } from '../../../../../../services/supabase-data.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss',
  standalone: false,
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  supabaseDataService = inject(SupabaseDataService);

  chartTurnosPorEspecialidad: any;
  chartTurnosPorDia: any;
  chartTurnosPorMedicoEnLapso: any;
  chartTurnosFinalizadosPorMedicoEnLapso: any;
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
      this.supabaseDataService.obtenerContenido("Usuarios"),
      this.supabaseDataService.obtenerContenido("Turnos"),
      this.supabaseDataService.obtenerContenido("Ingresos")
    ]);

    this.usuariosObtenidos = usuarios;
    this.turnosObtenidos = turnos;

    const fechaHoy = new Date().toLocaleDateString();
    this.ingresosObtenidos = ingresos.filter(i => i.fecha === fechaHoy);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}

  CargarGraficos(): void
  {
    this.CargarGraficoTurnosPorEspecialidad();
    this.CargarGraficoTurnosPorDia();
    this.CargarGraficoTurnosSolicitadosEnLapso();
    this.CargarGraficoTurnosFinalizadosEnLapso();
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
          if(estadisticas[usuario.especialidad] != null) { estadisticas[usuario.especialidad] = estadisticas[usuario.especialidad] + 1; }
          else { estadisticas[usuario.especialidad] = 1; }
        }
      }
    }

    const ctx = document.getElementById('chart-turnos-por-especialidad') as HTMLCanvasElement;

    this.chartTurnosPorEspecialidad = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(estadisticas), // Ejemplo
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(estadisticas), // Datos dinámicos
            backgroundColor: ['red', 'green', 'blue', "cyan", "yellow", "pink", "brown"]
          }
        ]
      },
      options: {
        responsive: true,
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
      if(estadisticas[turno.fecha.split(" ")[0]] != null) { estadisticas[turno.fecha.split(" ")[0]] = estadisticas[turno.fecha.split(" ")[0]] + 1; }
      else { estadisticas[turno.fecha.split(" ")[0]] = 1; }
    }

    const ctx = document.getElementById('chart-turnos-por-dia') as HTMLCanvasElement;

    this.chartTurnosPorDia = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos dados',
            data: Object.values(estadisticas),
            backgroundColor: ['red']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  CargarGraficoTurnosSolicitadosEnLapso(): void
  {
    let estadisticas: any = {};
    const fecha: Date = new Date();

    // -- Asigno la fecha a 15 dias adelantada. 
    fecha.setDate(fecha.getDate() + 15);

    for(const turno of this.turnosObtenidos)
      {
        for(const usuario of this.usuariosObtenidos)
        {
          if(turno.dniEspecialista == usuario.dni && turno.fecha)
          {
            const fechaSeparada: string = turno.fecha.split(" ")[1];
            const fechaFormateada: string = `${fechaSeparada.split("/")[2]}-${fechaSeparada.split("/")[1]}-${parseInt(fechaSeparada.split("/")[0])+1}`;
            const fechaParseada = new Date(fechaFormateada);

            if(fecha.getDate() < fechaParseada.getDate())
            {
              if(estadisticas[usuario.nombre] != null) { estadisticas[usuario.nombre] = estadisticas[usuario.nombre] + 1; }
              else { estadisticas[usuario.nombre] = 1; }
            }
          }
        }
      }

    const ctx = document.getElementById('chart-turnos-solicitados-lapso') as HTMLCanvasElement;

    this.chartTurnosPorDia = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos solicitados para este especialista en los últimos 15 días',
            data: Object.values(estadisticas),
            backgroundColor: ['red', 'aqua', 'pink', 'lightblue', 'yellow']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  CargarGraficoTurnosFinalizadosEnLapso(): void
  {
    let estadisticas: any = {};
    const fecha: Date = new Date();

    // -- Asigno la fecha a 15 dias adelantada. 
    fecha.setDate(fecha.getDate() + 15);

    for(const turno of this.turnosObtenidos)
      {
        for(const usuario of this.usuariosObtenidos)
        {
          if(turno.dniEspecialista == usuario.dni && turno.fecha && turno.estado == "Finalizado")
          {
            const fechaSeparada: string = turno.fecha.split(" ")[1];
            const fechaFormateada: string = `${fechaSeparada.split("/")[2]}-${fechaSeparada.split("/")[1]}-${parseInt(fechaSeparada.split("/")[0])+1}`;
            const fechaParseada = new Date(fechaFormateada);

            if(fecha.getDate() < fechaParseada.getDate())
            {
              if(estadisticas[usuario.nombre] != null) { estadisticas[usuario.nombre] = estadisticas[usuario.nombre] + 1; }
              else { estadisticas[usuario.nombre] = 1; }
            }
          }
        }
      }

    const ctx = document.getElementById('chart-turnos-finalizados-lapso') as HTMLCanvasElement;

    this.chartTurnosPorDia = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(estadisticas),
        datasets: [
          {
            label: 'Cantidad de turnos finalizados de este especialista en los últimos 15 días',
            data: Object.values(estadisticas),
            backgroundColor: ['red', 'aqua', 'pink', 'lightblue', 'yellow']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  DescargarPDF() 
  {
    // https://jsfiddle.net/crabbly/kL68ey5z/  ->  Ejemplo utilizado

    let canvasTurnosPorEspecialidad: any = document.querySelector('#chart-turnos-por-especialidad');
    let canvasTurnosPorDia: any = document.querySelector('#chart-turnos-por-dia');
    let canvasTurnosSolicitadosEnLapso: any = document.querySelector('#chart-turnos-solicitados-lapso');
    let canvasTurnosFinalizadosEnLapso: any = document.querySelector('#chart-turnos-finalizados-lapso');
    
    //creates image
    let canvasTurnosPorEspecialidadImg = canvasTurnosPorEspecialidad.toDataURL("image/PNG", 1.0);
    let canvasTurnosPorDiaImg = canvasTurnosPorDia.toDataURL("image/PNG", 1.0);
    let canvasTurnosSolicitadosEnLapsoImg = canvasTurnosSolicitadosEnLapso.toDataURL("image/PNG", 1.0);
    let canvasTurnosFinalizadosEnLapsoImg = canvasTurnosFinalizadosEnLapso.toDataURL("image/PNG", 1.0);
    
    //creates PDF from img
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Gráfico de barras para los turnos solicitados por especialidad", 5, 15);
    doc.addImage(canvasTurnosPorEspecialidadImg, 'PNG', 10, 20, 280, 150 );
    
    doc.addPage();
    
    doc.text("Gráfico de lineas para los turnos más solicitados por día", 5, 15);
    doc.addImage(canvasTurnosPorDiaImg, 'PNG', 10, 20, 280, 150 );
    
    doc.addPage();
    
    doc.text("Gráfico de torta para los especialistas con turnos solicitados en un lapso de 15 días", 5, 15);
    doc.addImage(canvasTurnosSolicitadosEnLapsoImg, 'PNG', 10, 20, 280, 150 );
    
    doc.addPage();
    
    doc.text("Gráfico de dona para los especialistas con turnos finalizados en un lapso de 15 días", 5, 15);
    doc.addImage(canvasTurnosFinalizadosEnLapsoImg, 'PNG', 10, 20, 280, 150 );
    
    doc.save('canvas.pdf');
  }
}
