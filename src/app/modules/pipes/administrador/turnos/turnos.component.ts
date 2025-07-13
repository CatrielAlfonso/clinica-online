import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Turno } from '../../../interfaces/ITurno';
import { UserService } from '../../../services/data/user.service';
import { SwalService } from '../../../services/swal.service';
import { FirestoreService } from '../../../services/firebase/firestore.service';
import { StorageService } from '../../../services/firebase/storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss'
})
export class TurnosComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  swalService = inject(SwalService);
  firestoreService = inject(FirestoreService);
  storageService = inject(StorageService);
  router = inject(Router);

  cargandoDatos: boolean;

  subscripciones: Subscription = new Subscription();

  rating = 6;

  turnosObtenidos: any[];
  especialistasObtenidos: any[];
  pacientesObtenidos: any[];
  filtroEspecialidad: string;
  filtroEspecialista: string;
  filtroPaciente: string;
  
  turnoSeleccionado: any;
  mensajeEstado: string;
  mensajeResenia: string;

  constructor() 
  {
    this.userService.ObtenerDatosUsuarioLogueado();

    this.cargandoDatos = true;
    this.turnosObtenidos = [];
    this.especialistasObtenidos = [];
    this.pacientesObtenidos = [];
    this.filtroEspecialidad = "";
    this.filtroEspecialista = "";
    this.filtroPaciente = "";
    this.turnoSeleccionado = null;
    this.mensajeEstado = "";
    this.mensajeResenia = "";

    this.ObtenerEspecialistas();
    this.ObtenerPacientes();
  }

  ngOnInit(): void 
  {
    setTimeout(() => { 
      this.ObtenerTurnos();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscripciones.unsubscribe();
  }

  ObtenerEspecialistas(): void
  {
    this.especialistasObtenidos.length = 0;
    const especialistasSubscription = this.firestoreService.ObtenerContenido("Usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Especialista") { this.especialistasObtenidos.push(usuario); }
      }
    });

    this.subscripciones.add(especialistasSubscription);
  }

  ObtenerPacientes(): void
  {
    this.pacientesObtenidos.length = 0;
    const pacientesSubscription = this.firestoreService.ObtenerContenido("Usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Paciente") { this.pacientesObtenidos.push(usuario); }
      }
    });

    this.subscripciones.add(pacientesSubscription);
  }

  ObtenerTurnos(): void
  {
    this.cargandoDatos = true; 
    const turnosSubscription = this.firestoreService.ObtenerContenido("Turnos").subscribe(turnos => {
      this.turnosObtenidos.length = 0;
      for(const turno of turnos)
      {
        for(const especialista of this.especialistasObtenidos)
        {
          for(const paciente of this.pacientesObtenidos)
          {
            if(turno.dniEspecialista == especialista.dni && turno.dniPaciente == paciente.dni)
            {
              const objetoTurnoTabla: any = {
                id: turno.id,
                fecha: turno.fecha,
                horario: turno.horario,
                dniEspecialista: turno.dniEspecialista, 
                dniPaciente: turno.dniPaciente,
                estado: turno.estado,
                mensajeEstado: turno.mensajeEstado,
                valoracionConsulta: turno.valoracionConsulta,
                comentarioValoracion: turno.comentarioValoracion,
                nombreEspecialista: especialista.nombre,
                apellidoEspecialista: especialista.apellido,
                especialidadEspecialista: especialista.especialidad,
                imagenPerfilEspecialista: especialista.imagenPerfil,
                nombrePaciente: paciente.nombre,
                apellidoPaciente: paciente.apellido,
                imagen1Paciente: paciente.imagen1,
                imagen2Paciente: paciente.imagen2
              }

              this.turnosObtenidos.push(objetoTurnoTabla);
            }
          }
        }
      }
      this.cargandoDatos = false; 
      console.log(this.turnosObtenidos);
    });

    this.subscripciones.add(turnosSubscription);
  }

  FiltrarEspecialistas(filtroIngresado: string): void
  {
    this.cargandoDatos = true;
    this.ObtenerEspecialistas();
    setTimeout(() => {      
      if(filtroIngresado != "")
      {
        let nuevosEspecialistas: any[] = [];
        for(const especialista of this.especialistasObtenidos)
        {
          const nombreEspecialista: string = especialista.nombre;
          if(nombreEspecialista.includes(filtroIngresado)) { nuevosEspecialistas.push(especialista); }
        }
        this.especialistasObtenidos.length = 0;
        this.especialistasObtenidos = nuevosEspecialistas;
      }
      else 
      { 
        this.ObtenerEspecialistas();
        this.ObtenerPacientes()
        this.ObtenerTurnos(); 
      }
    }, 2000);

    setTimeout(() => { 
      this.ObtenerTurnos(); 
      this.cargandoDatos = false;
    }, 2000);
    this.filtroEspecialista = "";
  }

  FiltrarEspecialidades(filtroIngresado: string): void
  {
    this.cargandoDatos = true;
    this.ObtenerEspecialistas()

    setTimeout(() => {
      if(filtroIngresado != "")
      {
        let nuevosEspecialistas: any[] = [];
        for(const especialista of this.especialistasObtenidos)
        {
          const especialidadEspecialista: string = especialista.especialidad;
          console.log(especialista);
          console.log(filtroIngresado);
          if(especialidadEspecialista.includes(filtroIngresado)) {console.log("coincidencia"); nuevosEspecialistas.push(especialista); }
        }
        this.especialistasObtenidos.length = 0;
        this.especialistasObtenidos = nuevosEspecialistas;
      }
      else 
      { 
        this.ObtenerEspecialistas();
        this.ObtenerPacientes()
        this.ObtenerTurnos(); 
      }
    }, 2000);

    setTimeout(() => { 
      this.ObtenerTurnos(); 
      this.cargandoDatos = false;
    }, 2000);
    this.filtroEspecialidad = "";
  }

  CancelarTurno(turno: any, mensajeEstadoIngresado: string): void //Añadir mensaje de cancelacion
  {
    const objetoTurnoNuevo: Turno = {
      dniEspecialista: turno.dniEspecialista,
      dniPaciente: turno.dniPaciente,
      fecha: turno.fecha,
      horario: turno.horario,
      estado: "Cancelado",
      mensajeEstado: "Turno cancelado por: " + this.userService.rolUsuarioLogueado + ". Mensaje: " + mensajeEstadoIngresado,
      comentarioValoracion: "",
      valoracionConsulta: 0
    }
    console.log(turno.id);
    this.firestoreService.ModificarContenido("Turnos", turno.id, objetoTurnoNuevo);
  }

  AsignarTurnoSeleccionado(turno: any): void
  {
    this.turnoSeleccionado = turno;
    console.log(this.turnoSeleccionado)
  }
}