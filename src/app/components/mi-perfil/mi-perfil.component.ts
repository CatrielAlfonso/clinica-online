import { Component, inject, OnDestroy, OnInit } from '@angular/core';
//import { FirestoreService } from '../../services/firebase/firestore.service';
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
    const margenSuperior = 20;
    const espacioEntreLineas = 10;
    const logoClinica = new Image();
    logoClinica.src = "/imgs/iconoClinica.png";
    let y = 50;

    const anchoPagina: number = doc.internal.pageSize.getWidth();

    doc.addImage(logoClinica, "png", anchoPagina - 55, 7, 30, 20);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("Mi Historia clínica", anchoPagina / 2, 20, { align: "center" });
    doc.setDrawColor(0); // negro
    doc.line(20, 35, anchoPagina - 20, 35);

    doc.setFontSize(14);
    doc.text(`Paciente: ${historiaClinicaPaciente.nombrePaciente}`, 10, y);
    y += espacioEntreLineas;
    doc.text(`Edad: ${historiaClinicaPaciente.edadPaciente}`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Documento: ${historiaClinicaPaciente.dniPaciente}`, margenIzquierdo, y);
    y += espacioEntreLineas;
    doc.text(`Visitas al ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}: ${historiaClinicaPaciente.visitas.length} visitas`, margenIzquierdo, y);

    let pagina: number = 1;

    doc.text(`${pagina}`, anchoPagina / 2 , 290);

    for(const visita of historiaClinicaPaciente.visitas)
    {
      if(visita.especialidadVisitada == this.especialidadSeleccionada || this.especialidadSeleccionada == "Todas" || this.especialidadSeleccionada == "")
      {
        doc.addPage();
        pagina = pagina + 1;
        
        doc.setFont('PTSans', 'bold')
        doc.text("VISITAS",anchoPagina / 2 ,20,{ align: "center" });
        doc.setFont("helvetica", "bold");
        doc.text(`Fecha de visita: ${visita.fechaVisita}`, 20, 40);
        doc.text(`Horario de visita: ${visita.horarioVisita}`, 20, 60);
        doc.text(`Especialidad visitada: ${visita.especialidadVisitada}`, 20, 80);
        doc.text(`Especialista visitado: ${visita.nombreEspecialista}`, 20, 100);
        doc.text(`Dni especialista: ${visita.dniEspecialista}`, 20, 120);
        doc.text(`Altura del paciente: ${visita.alturaPaciente}`, 20, 140);
        doc.text(`Peso del paciente: ${visita.pesoPaciente}`, 20, 160);
        doc.text(`Temperatura del paciente: ${visita.temperaturaPaciente}`, 20, 180);
        doc.text(`Presion del paciente: ${visita.presionPaciente}`, 20, 200);
        doc.text(`Diagnóstico: ${visita.diagnosticoPaciente}`, 20, 220);
        const textoSpliteado = doc.splitTextToSize(`Detalle del diagnóstico: ${visita.detalleDiagnosticoPaciente}`, anchoPagina - 20);
        doc.text(textoSpliteado, 20, 240);

        doc.text(`${pagina}`, anchoPagina / 2, 290);
      }
    }

    doc.save(`HistoriaClinica-${historiaClinicaPaciente.nombrePaciente}-${fecha.getDate()}${fecha.getMonth() + 1}.pdf`);
  }
}
