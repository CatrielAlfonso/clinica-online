import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
//import { authResponse, AuthService } from '../../services/firebase/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
//import { StorageService } from '../../services/firebase/storage.service';
//import { UserService } from '../../services/data/user.service';
import { Turno } from '../../interfaces/ITurno';
import { Subscription } from 'rxjs';
import { AuthService, authResponse } from '../../services/auth.service';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgrandarOnHoverDirective } from '../../directives/agrandar-on-hover.directive';
import { DeshabilitarOnClickDirective } from '../../directives/deshabilitar-on-click.directive';
import { ResaltarOnHoverDirective } from '../../directives/resaltar-on-hover.directive';

@Component({
  selector: 'app-alta-turno',
  templateUrl: './alta-turno.component.html',
  styleUrl: './alta-turno.component.scss',
  imports: [FormsModule,CommonModule, PipesModule, ReactiveFormsModule, AgrandarOnHoverDirective, DeshabilitarOnClickDirective,
    ResaltarOnHoverDirective
  ],
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos para modificar mat-radio-button
})
export class AltaTurnoComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  swalService = inject(SweetAlertService);
  firestoreService = inject(AuthService);
  storageService = inject(SupabaseStorageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  cargandoDatos: boolean;

  especialidadSeleccionada: string;
  especialistaSeleccionado: any;
  diaSeleccionado: string;
  horarioSeleccionado: string;

  subscripciones: Subscription = new Subscription();

  especialidadesDisponibles: string[];
  especialistasDisponibles: any[];
  diasDisponibles: any[];
  horariosDisponibles: any[];
  pacientesObtenidos: any[];
  pacienteSeleccionado: any;
  

  especialistasObtenidos: any[];

  formPaciente!: FormGroup;
  formAdministrador!: FormGroup;

  constructor() 
  {
    this.cargandoDatos = true;

    this.formPaciente = this.formBuilder.group({
      // especialidad: ['', [Validators.required]],
      especialista: ['', [Validators.required]],
      dia: ['', [Validators.required]],
      horario: ['', [Validators.required]],
    });

    this.formAdministrador = this.formBuilder.group({
      paciente: ['', [Validators.required]],
      // especialidad: ['', [Validators.required]],
      especialista: ['', [Validators.required]],
      dia: ['', [Validators.required]],
      horario: ['', [Validators.required]],
    });

    this.especialidadSeleccionada = "";
    this.especialistaSeleccionado = null;
    this.pacienteSeleccionado = null;
    this.diaSeleccionado = "";
    this.horarioSeleccionado = "";

    this.especialistasObtenidos = [];
    this.especialidadesDisponibles = [];
    this.especialistasDisponibles = [];
    this.diasDisponibles = [];
    this.horariosDisponibles = [];
    this.pacientesObtenidos = [];

    this.ObtenerEspecialistas();
    this.ObtenerDiasDisponibles();
    this.ObtenerPacientes();
  }

  ngOnInit(): void 
  {
    setTimeout(() => {
      // this.ObtenerEspecialidades();
      this.cargandoDatos = false;
      console.log(`rolusuariologueado ${this.userService.rolUsuarioLogueado}`)

    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscripciones.unsubscribe();
  }

  ObtenerEspecialidades(): void
  {
    for(const especialista of this.especialistasObtenidos) 
    { 
      if(!this.especialidadesDisponibles.includes(especialista.especialidad)) { this.especialidadesDisponibles.push(especialista.especialidad); } 
    }
  }

  ObtenerEspecialistas(): void
  {
    this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Especialista") { this.especialistasObtenidos.push(usuario); }
      }
      this.ObtenerEspecialidades();
    });
  }

  ObtenerPacientes(): void
  {
    this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Paciente") { this.pacientesObtenidos.push(usuario); }
      }
    });
  }

  ObtenerEspecialistasDisponibles(especialidadIngresada: string): void
  {
    this.especialistasDisponibles.length = 0;
    this.diaSeleccionado = "";
    this.horarioSeleccionado = "";
    this.formPaciente.patchValue({dia: "", horario: ""});
    this.formAdministrador.patchValue({dia: "", horario: ""});
    for(const especialista of this.especialistasObtenidos)
    {
      if(especialista.especialidad == especialidadIngresada) { this.especialistasDisponibles.push(especialista); }
    }
  }

  AsignarEspecialista(especialistaSeleccionado: any)
  {
    this.diaSeleccionado = "";
    this.horarioSeleccionado = "";
    this.formPaciente.patchValue({dia: "", horario: ""});
    this.formAdministrador.patchValue({dia: "", horario: ""});
    this.formPaciente.patchValue({especialista: especialistaSeleccionado.dni});
    this.formAdministrador.patchValue({especialista: especialistaSeleccionado.dni});
    this.especialistaSeleccionado = especialistaSeleccionado;
    this.horarioSeleccionado = "";
    this.diaSeleccionado = "";
    this.ObtenerTurnosDisponibles();

    let btnEspecialistaSeleccionado: HTMLButtonElement = <HTMLButtonElement> document.getElementById(especialistaSeleccionado.dni);
    let btnEspecialistas: HTMLCollectionOf<Element> = document.getElementsByClassName("btn-especialistas");

    for(let i = 0; i < btnEspecialistas.length; i++)
    {
      let btnEspecialista = btnEspecialistas.item(i) as HTMLElement; // Debo hacer la conversión de Element a HTMLElement.
      if(btnEspecialista){ btnEspecialista.style.backgroundColor = "#ffffff00"; }
    }
    btnEspecialistaSeleccionado.style.backgroundColor = "#55ddffd7"
    console.log(`especialista seleccionado: ${JSON.stringify(especialistaSeleccionado)}`);
  }

  AsignarPaciente(pacienteSeleccionado: any)
  {
    this.formAdministrador.patchValue({paciente: pacienteSeleccionado.dni});
    this.pacienteSeleccionado = pacienteSeleccionado;
    this.horarioSeleccionado = "";
    this.diaSeleccionado = "";
    console.log(`paciente seleccionado: ${JSON.stringify(pacienteSeleccionado)}`);
  }

  ObtenerDiasDisponibles(): void
  {
    let fecha: Date = new Date();

    while(this.diasDisponibles.length != 15) 
    {
      if(new Date(fecha).getDay() !== 0) { this.diasDisponibles.push(`${this.ParsearDia(fecha.getDay())} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`); }
      fecha.setDate(fecha.getDate() + 1);
    }
  }

  ParsearDiaIndex(diaNombre: string): number 
  {
    switch (diaNombre) {
      case "Lunes": return 0;
      case "Martes": return 1;
      case "Miércoles": return 2;
      case "Jueves": return 3;
      case "Viernes": return 4;
      case "Sábado": return 5;
      default: return -1;
    }
  }

  ParsearHora(horaStr: string): Date 
  {
    const [horas, minutos] = horaStr.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0);
    return fecha;
  }
  
  turnosDisponibles: any[] = [];
  ObtenerTurnosDisponibles(): void
  {
    this.turnosDisponibles.length = 0;

    let dni: number = 0;
    let horariosNoDisponibles: string[] = [];
    let horarios: string[] = [];

    if(this.userService.rolUsuarioLogueado == "Administrador") { dni = this.pacienteSeleccionado.dni; }
    else if(this.userService.rolUsuarioLogueado == "Paciente") { dni = this.userService.dniUsuarioLogueado; }


    const subTurnos: Subscription = this.firestoreService.obtenerContenidoAsObservable("turnos").subscribe(turnos => {
      if(this.diasDisponibles && this.especialistaSeleccionado)
      {
        for(const dia of this.diasDisponibles)
        {
          const diaIndex = this.ParsearDiaIndex(dia.split(" ")[0]);
          
          for(const turno of turnos)
          {
            if(turno.fecha == dia && (turno.dniPaciente == dni || turno.dniEspecialista == this.especialistaSeleccionado.dni) && turno.estado != "Cancelado")
            {
              console.log("Turno ocupado: " + turno.horario)
              horariosNoDisponibles.push(turno.horario);
            }
          }

          if(dia.split(" ")[0] == "Sábado")
          {
            horarios = [ "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00" ];
            for(const horario of horarios)
            {
              if(!horariosNoDisponibles.includes(horario) && horario >= this.especialistaSeleccionado.horariosDisponibles[5].split("-")[0] && horario <= this.especialistaSeleccionado.horariosDisponibles[5].split("-")[1]) 
              { 
                const diaParseado = dia.split(" ")[1].split("/")[0] + "/" + dia.split(" ")[1].split("/")[1]
                this.turnosDisponibles.push(diaParseado + " " + horario);             
              }
            }
          }
          else 
          {
            horarios = [ "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00" ];
            for(const horario of horarios)
            {
              if(!horariosNoDisponibles.includes(horario) && horario >= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[0] && horario <= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[1]) 
              { 
                const diaParseado = dia.split(" ")[1].split("/")[0] + "/" + dia.split(" ")[1].split("/")[1]
                this.turnosDisponibles.push(diaParseado + " " + horario); 
              }
            }
          }
        }
      }
    });

    this.subscripciones.add(subTurnos);
  }

  AsignarTurno(turno: string)
  {
    for(const dia of this.diasDisponibles)
    {
      const diaSeparado: string = dia.split(" ")[1];
      const diaParseado: string = diaSeparado.split("/")[0] + "/" + diaSeparado.split("/")[1]; 

      if(turno.split(" ")[0] == diaParseado) 
      {
        this.diaSeleccionado = dia;
        this.horarioSeleccionado = turno.split(" ")[1]; 
        this.formPaciente.patchValue({dia: dia});
        this.formAdministrador.patchValue({dia: dia});
        this.formPaciente.patchValue({horario: turno.split(" ")[1]});
        this.formAdministrador.patchValue({horario: turno.split(" ")[1]});
      }
    }
  }

  ParsearDia(dia: number): string
  {
    if(dia == 0) { return "Domingo"; }
    else if(dia == 1) { return "Lunes"; }
    else if(dia == 2) { return "Martes"; }
    else if(dia == 3) { return "Miércoles"; }
    else if(dia == 4) { return "Jueves"; }
    else if(dia == 5) { return "Viernes"; }
    else { return "Sábado"; }
  }

  SolicitarTurno()
  {
    try 
    {
      let dni: number = 0;

      if(this.userService.rolUsuarioLogueado == "Administrador") { dni = this.pacienteSeleccionado.dni; }
      else if(this.userService.rolUsuarioLogueado == "Paciente") { dni = this.userService.dniUsuarioLogueado; }

      const objetoTurno: Turno = { 
        dniEspecialista: this.especialistaSeleccionado.dni, 
        dniPaciente: dni.toString(), 
        fecha: this.diaSeleccionado, 
        horario: this.horarioSeleccionado, 
        estado: "Pendiente",
        mensajeEstado: "",
        valoracionConsulta: 0,
        comentarioValoracion: ""
      };

      console.log(objetoTurno);

      this.firestoreService.GuardarContenido("turnos", objetoTurno);
      this.swalService.LanzarAlert("Turno agendado exitosamente!", "success", "El turno fue agendado y queda a la espera de la aprobación por parte del especialista. Puedes ver tu turno en la sección 'Mis turnos'!");
      this.formPaciente.reset();
      this.formAdministrador.reset();
      this.diaSeleccionado = "";
      this.horarioSeleccionado = "";
      this.pacienteSeleccionado = null;
      this.especialistaSeleccionado = null;
      this.especialidadSeleccionada = "";
    }
    catch(error) { this.swalService.LanzarAlert("Error al agendar el turno", "error", `${error}`); }
  }
}