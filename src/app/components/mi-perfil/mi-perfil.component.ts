import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { jsPDF } from "jspdf";
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss',
  imports:[CommonModule,PipesModule,FormsModule]
})
export class MiPerfilComponent implements OnInit, OnDestroy{
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  swalService: SweetAlertService = inject(SweetAlertService);
  
  miPerfil: any;
  obteniendoDatos: boolean;
  subscripciones: Subscription = new Subscription();

  historiaClinicaPaciente: any = {};

  horarioInicioLunes: string;
  horarioFinLunes: string;
  horarioInicioMartes: string;
  horarioFinMartes: string;
  horarioInicioMiercoles: string;
  horarioFinMiercoles: string;
  horarioInicioJueves: string;
  horarioFinJueves: string;
  horarioInicioViernes: string;
  horarioFinViernes: string;
  horarioInicioSabados: string;
  horarioFinSabados: string;
  especialidadSeleccionada: string;
  especialidadesObtenidas: string[] = ["Todas"];

  constructor() 
  {
    this.obteniendoDatos = true;
    this.miPerfil = {};
    this.horarioInicioLunes = "";
    this.horarioFinLunes = "";
    this.horarioInicioMartes = "";
    this.horarioFinMartes = "";
    this.horarioInicioMiercoles = "";
    this.horarioFinMiercoles = "";
    this.horarioInicioJueves = "";
    this.horarioFinJueves = "";
    this.horarioInicioViernes = "";
    this.horarioFinViernes = "";
    this.horarioInicioSabados = "";
    this.horarioFinSabados = "";
    this.especialidadSeleccionada = "";

    this.ObtenerEspecialidades();
  }

  async ngOnInit(): Promise<void> {
    this.miPerfil = await this.userService.ObtenerDatosUsuarioLogueado();   

    const subHistorias = this.authService.obtenerContenidoAsObservable("historiasclinicas").subscribe(historias => {
      console.log(this.miPerfil.dni);
      for(const historia of historias)
      {
        if(historia.dniPaciente == this.miPerfil.dni) { this.historiaClinicaPaciente = historia; }
      }
      console.log(this.historiaClinicaPaciente);
      
    });

    if(this.miPerfil.horariosDisponibles)
    {
      if(this.miPerfil.horariosDisponibles[0].split("-").length == 2) 
      {
        this.horarioInicioLunes = this.miPerfil.horariosDisponibles[0].split("-")[0]; 
        this.horarioFinLunes = this.miPerfil.horariosDisponibles[0].split("-")[1]; 
      }
        
      if(this.miPerfil.horariosDisponibles[1].split("-").length == 2) 
      {
        this.horarioInicioMartes = this.miPerfil.horariosDisponibles[1].split("-")[0]; 
        this.horarioFinMartes = this.miPerfil.horariosDisponibles[1].split("-")[1]; 
      }
      
      if(this.miPerfil.horariosDisponibles[2].split("-").length == 2) 
      {
        this.horarioInicioMiercoles = this.miPerfil.horariosDisponibles[2].split("-")[0]; 
        this.horarioFinMiercoles = this.miPerfil.horariosDisponibles[2].split("-")[1]; 
      }
        
      if(this.miPerfil.horariosDisponibles[3].split("-").length == 2) 
      {
        this.horarioInicioJueves = this.miPerfil.horariosDisponibles[3].split("-")[0]; 
        this.horarioFinJueves = this.miPerfil.horariosDisponibles[3].split("-")[1]; 
      }
        
      if(this.miPerfil.horariosDisponibles[4].split("-").length == 2) 
      {
        this.horarioInicioViernes = this.miPerfil.horariosDisponibles[4].split("-")[0]; 
        this.horarioFinViernes = this.miPerfil.horariosDisponibles[4].split("-")[1]; 
      }
      
      if(this.miPerfil.horariosDisponibles[5].split("-").length == 2) 
      {
        this.horarioInicioSabados = this.miPerfil.horariosDisponibles[5].split("-")[0]; 
        this.horarioFinSabados = this.miPerfil.horariosDisponibles[5].split("-")[1]; 
      }
    }

    this.subscripciones.add(subHistorias);
    this.obteniendoDatos = false;
  }

  ngOnDestroy(): void { this.subscripciones.unsubscribe(); }

  ObtenerEspecialidades(): void
  {
    const subUsuarios = this.authService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(!this.especialidadesObtenidas.includes(usuario.especialidad) && usuario.especialidad) { this.especialidadesObtenidas.push(usuario.especialidad); }
      }
    });

    this.subscripciones.add(subUsuarios);
  }

  async ActualizarHorarios(): Promise<void>
  {
    this.obteniendoDatos = true;

    const horariosInicio: string[] = [
      this.horarioInicioLunes, 
      this.horarioInicioMartes, 
      this.horarioInicioMiercoles, 
      this.horarioInicioJueves, 
      this.horarioInicioViernes, 
      this.horarioInicioSabados
    ];

    let horarioInicioLunesValidado: boolean = false;
    let horarioInicioMartesValidado: boolean = false;
    let horarioInicioMiercolesValidado: boolean = false;
    let horarioInicioJuevesValidado: boolean = false;
    let horarioInicioViernesValidado: boolean = false;
    let horarioInicioSabadoValidado: boolean = false;

    let contador = 0;

    for(const horarioInicio of horariosInicio)
    {
      if(horarioInicio != "" && horarioInicio.split(":").length == 2 && (horarioInicio.split(":")[0].length == 2 && horarioInicio.split(":")[1].length == 2) && !isNaN(parseInt(horarioInicio.split(":")[0])) && !isNaN(parseInt(horarioInicio.split(":")[1]))) 
      { 
        if(horarioInicio.split(":")[0] < "08" || horarioInicio.split(":")[0] > "19" || horarioInicio.split(":")[1] > "59" || (horarioInicio.split(":")[1] != "00" && horarioInicio.split(":")[1] < "00"))
        {
          console.log(horarioInicio)
          console.log(contador)
          console.log(horarioInicioSabadoValidado)
          this.swalService.LanzarAlert(
            "Error en el ingreso de horarios!",
            "error", 
            "Verifique que sus horarios de inicio estén dentro del umbral de atención de la clínica (lu-vie 08:00-19:00, sa 08:00-14:00)."
          );

          return;  
        }
      }
      else if(horarioInicio != "")
      {
        this.swalService.LanzarAlert(
          "Error en el ingreso de horarios!", 
          "error", 
          "Verifique que sus horarios de inicio cumplan con un formato de horario hh:mm."
        );

        return; 
      }

      if(contador == 0) { horarioInicioLunesValidado = true; }
      if(contador == 1) { horarioInicioMartesValidado = true; }
      if(contador == 2) { horarioInicioMiercolesValidado = true; }
      if(contador == 3) { horarioInicioJuevesValidado = true; }
      if(contador == 4) { horarioInicioViernesValidado = true; }
      if(contador == 5) { horarioInicioSabadoValidado = true; }
      
      contador++;
    }

    let objetoHorarios: any[] = []; 

    const horariosFin: string[] = [
      this.horarioFinLunes,
      this.horarioFinMartes,
      this.horarioFinMiercoles,
      this.horarioFinJueves,
      this.horarioFinViernes,
      this.horarioFinSabados
    ];

    let horarioFinLunesValidado: boolean = false;
    let horarioFinMartesValidado: boolean = false;
    let horarioFinMiercolesValidado: boolean = false;
    let horarioFinJuevesValidado: boolean = false;
    let horarioFinViernesValidado: boolean = false;
    let horarioFinSabadoValidado: boolean = false;
    
    contador = 0;
    
    for(const horarioFin of horariosFin)
    {
      if(horarioFin != "" && horarioFin.split(":").length == 2 && (horarioFin.split(":")[0].length == 2 && horarioFin.split(":")[1].length == 2) && !isNaN(parseInt(horarioFin.split(":")[0])) && !isNaN(parseInt(horarioFin.split(":")[1]))) 
      { 
        if(contador != 5)
        {
          if(horarioFin.split(":")[0] < "08" || horarioFin.split(":")[0] > "19" || horarioFin.split(":")[1] > "59" || (horarioFin.split(":")[1] != "00" && horarioFin.split(":")[1] < "00"))
          {
            this.swalService.LanzarAlert(
              "Error en el ingreso de horarios!",
              "error", 
              "Verifique que sus horarios de fin estén dentro del umbral de atención de la clínica (lu-vie 08:00-19:00, sa 08:00-14:00)."
            );
  
            return;  
          }
        }
        else
        {
          if(horarioFin.split(":")[0] < "08" || horarioFin.split(":")[0] > "14" || horarioFin.split(":")[1] > "59" || (horarioFin.split(":")[1] != "00" && horarioFin.split(":")[1] < "00"))
          {
            this.swalService.LanzarAlert(
              "Error en el ingreso de horarios!",
              "error", 
              "Verifique que sus horarios de fin estén dentro del umbral de atención de la clínica (lu-vie 08:00-19:00, sa 08:00-14:00)."
            );
  
            return;  
          }
        }
      }
      else if(horarioFin != "")
      {
        this.swalService.LanzarAlert(
          "Error en el ingreso de horarios!", 
          "error", 
          "Verifique que sus horarios de fin cumplan con un formato de horario hh:mm."
        );

        return; 
      }

      if(contador == 0) { horarioFinLunesValidado = true; }
      if(contador == 1) { horarioFinMartesValidado = true; }
      if(contador == 2) { horarioFinMiercolesValidado = true; }
      if(contador == 3) { horarioFinJuevesValidado = true; }
      if(contador == 4) { horarioFinViernesValidado = true; }
      if(contador == 5) { horarioFinSabadoValidado = true; }
      
      contador++;
    }

    if(horarioInicioLunesValidado && horarioFinLunesValidado && this.horarioFinLunes > this.horarioInicioLunes) 
    { 
      objetoHorarios.push(`${this.horarioInicioLunes}-${this.horarioFinLunes}`) 
    }
    else { objetoHorarios.push(""); }

    if(horarioInicioMartesValidado && horarioFinMartesValidado && this.horarioFinMartes > this.horarioInicioMartes) 
    { 
      objetoHorarios.push(`${this.horarioInicioMartes}-${this.horarioFinMartes}`) 
    }
    else { objetoHorarios.push(""); }
  
    if(horarioInicioMiercolesValidado && horarioFinMiercolesValidado && this.horarioFinMiercoles > this.horarioInicioMiercoles) 
    { 
      objetoHorarios.push(`${this.horarioInicioMiercoles}-${this.horarioFinMiercoles}`) 
    }
    else { objetoHorarios.push(""); }

    if(horarioInicioJuevesValidado && horarioFinJuevesValidado && this.horarioFinJueves > this.horarioInicioJueves) 
    { 
      objetoHorarios.push(`${this.horarioInicioJueves}-${this.horarioFinJueves}`) 
    }
    else { objetoHorarios.push(""); }

    if(horarioInicioViernesValidado && horarioFinViernesValidado && this.horarioFinViernes > this.horarioInicioViernes) 
    { 
      objetoHorarios.push(`${this.horarioInicioViernes}-${this.horarioFinViernes}`) 
    }
    else { objetoHorarios.push(""); }

    if(horarioInicioSabadoValidado && horarioFinSabadoValidado && this.horarioFinSabados > this.horarioInicioSabados) 
    { 
      objetoHorarios.push(`${this.horarioInicioSabados}-${this.horarioFinSabados}`) 
    }
    else { objetoHorarios.push(""); }

    const nuevoPerfil = {
      nombre: this.miPerfil.nombre,
      apellido: this.miPerfil.apellido,
      dni: this.miPerfil.dni,
      edad: this.miPerfil.edad,
      email: this.miPerfil.email,
      especialidad: this.miPerfil.especialidad,
      rol: this.miPerfil.rol,
      horariosDisponibles: objetoHorarios,
      imagen1: this.miPerfil.imagen1,
      habilitado: true,
    }

    await this.authService.modificarContenido("usuarios", this.miPerfil.id, nuevoPerfil);
    this.obteniendoDatos = false;
    this.swalService.LanzarAlert("Turnos actualizados!", "success");
  }

  ExportarHistoriaClinica(historiaClinicaPaciente: any): void
  {
    const doc = new jsPDF();
    const fecha = new Date();
    const margenIzquierdo = 20;
    const margenDerecho = 190;
    const espacioEntreLineas = 8;
    const logoClinica = new Image();
    logoClinica.src = "/imgs/iconoClinica.png";

    const anchoPagina: number = doc.internal.pageSize.getWidth();
    const altoPagina: number = doc.internal.pageSize.getHeight();

    // Primera página - Portada
    doc.addImage(logoClinica, "png", anchoPagina - 55, 7, 30, 20);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("Mi Historia Clínica", anchoPagina / 2, 20, { align: "center" });
    doc.setDrawColor(0);
    doc.line(20, 35, anchoPagina - 20, 35);

    let y = 50;
    doc.setFontSize(14);
    doc.text(`Paciente: ${historiaClinicaPaciente.nombrePaciente}`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Edad: ${historiaClinicaPaciente.edadPaciente} años`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Documento: ${this.formatearDni(historiaClinicaPaciente.dniPaciente)}`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Total de Visitas: ${historiaClinicaPaciente.visitas.length}`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Fecha de emisión: ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, margenIzquierdo, y);

    // Agregar número de página
    doc.setFontSize(10);
    doc.text(`Página 1`, anchoPagina / 2, altoPagina - 10, { align: "center" });

    let numeroPagina = 1;

    // Filtrar visitas según especialidad seleccionada
    const visitasFiltradas = historiaClinicaPaciente.visitas.filter((visita: any) => 
      visita.especialidadVisitada === this.especialidadSeleccionada || 
      this.especialidadSeleccionada === "Todas" || 
      this.especialidadSeleccionada === ""
    );

    // Una página por cada visita
    for(let i = 0; i < visitasFiltradas.length; i++)
    {
      const visita = visitasFiltradas[i];
      
      doc.addPage();
      numeroPagina++;
      
      y = 20;
      
      // Encabezado de la página
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`Visita #${i + 1}`, anchoPagina / 2, y, { align: "center" });
      y += 15;
      
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(20, y, anchoPagina - 20, y);
      y += 10;

      // Información de la consulta
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.text("📋 INFORMACIÓN DE LA CONSULTA", margenIzquierdo, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      doc.text(`Fecha: ${visita.fechaVisita}`, margenIzquierdo, y);
      doc.text(`Horario: ${visita.horarioVisita}`, margenIzquierdo + 90, y);
      y += 6;
      
      doc.text(`Especialidad: ${visita.especialidadVisitada}`, margenIzquierdo, y);
      y += 6;
      
      doc.text(`Especialista: ${visita.nombreEspecialista} ${visita.apellidoEspecialista}`, margenIzquierdo, y);
      y += 6;
      
      doc.text(`DNI Especialista: ${this.formatearDni(visita.dniEspecialista)}`, margenIzquierdo, y);
      y += 10;

      // Signos Vitales
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 153, 51);
      doc.text("💓 SIGNOS VITALES", margenIzquierdo, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      const col1X = margenIzquierdo;
      const col2X = margenIzquierdo + 90;
      
      doc.text(`Altura: ${visita.alturaPaciente} cm`, col1X, y);
      doc.text(`Peso: ${visita.pesoPaciente} kg`, col2X, y);
      y += 6;
      
      doc.text(`Temperatura: ${visita.temperaturaPaciente} °C`, col1X, y);
      doc.text(`Presión: ${visita.presionPaciente}`, col2X, y);
      y += 10;

      // Diagnóstico
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(204, 153, 0);
      doc.text("🔍 DIAGNÓSTICO", margenIzquierdo, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      doc.text(`Clave: ${visita.diagnosticoPaciente}`, margenIzquierdo, y);
      y += 6;
      
      const textoSpliteado = doc.splitTextToSize(
        `Detalle: ${visita.detalleDiagnosticoPaciente}`, 
        margenDerecho - margenIzquierdo
      );
      doc.text(textoSpliteado, margenIzquierdo, y);
      y += textoSpliteado.length * 5 + 5;

      // Datos Dinámicos (NUEVO)
      if (visita.datosDinamicos && Object.keys(visita.datosDinamicos).length > 0) {
        // Verificar si hay espacio suficiente, si no, agregar nueva página
        if (y > altoPagina - 60) {
          doc.addPage();
          numeroPagina++;
          y = 20;
          
          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.text(`Continuación Visita #${i + 1}`, anchoPagina / 2, y, { align: "center" });
          y += 10;
        }
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(153, 51, 204);
        doc.text("📊 DATOS ADICIONALES", margenIzquierdo, y);
        y += 8;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        for (const clave in visita.datosDinamicos) {
          const dato = visita.datosDinamicos[clave];
          
          // Verificar espacio
          if (y > altoPagina - 20) {
            doc.addPage();
            numeroPagina++;
            y = 20;
          }
          
          let valorTexto = `${dato.valor}`;
          if (dato.unidad) {
            valorTexto += ` ${dato.unidad}`;
          }
          
          doc.setFont("helvetica", "bold");
          doc.text(`• ${clave}:`, margenIzquierdo, y);
          doc.setFont("helvetica", "normal");
          doc.text(valorTexto, margenIzquierdo + 60, y);
          y += 6;
        }
      }

      // Número de página
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${numeroPagina}`, anchoPagina / 2, altoPagina - 10, { align: "center" });
    }

    doc.save(`HistoriaClinica-${historiaClinicaPaciente.nombrePaciente}-${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}.pdf`);
  }

  private formatearDni(dni: number | string): string {
    const dniStr = dni.toString();
    return dniStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}