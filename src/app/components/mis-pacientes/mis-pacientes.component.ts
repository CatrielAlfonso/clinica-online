import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
//import { authResponse, AuthService } from '../../services/firebase/auth.service';
import { Router } from '@angular/router';
//import { FirestoreService } from '../../services/firebase/firestore.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
//import { StorageService } from '../../services/firebase/storage.service';
//import { UserService } from '../../services/data/user.service';
import { Turno } from '../../interfaces/ITurno';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import { AuthService, authResponse } from '../../services/auth.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';


@Component({
  selector: 'app-mis-pacientes',
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.scss',
  imports: [CommonModule, FormsModule, PipesModule],
})
export class MisPacientesComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  swalService = inject(SweetAlertService);
  firestoreService = inject(AuthService);
  storageService = inject(SupabaseStorageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  cargandoDatos: boolean;

  subscripciones: Subscription = new Subscription();

  turnosObtenidos: any[];
  turnosEspecialista: any[];
  turnosPaciente: any[];
  especialistasObtenidos: any[];
  historiasClinicasObtenidas: any[];
  historiaClinicaDetallada: any = {};
  pacientesAtendidos: any[];
  pacientesObtenidos: any[];
  
  turnoSeleccionado: any;

  constructor() 
  {
    this.userService.ObtenerDatosUsuarioLogueado();

    this.cargandoDatos = true;
    this.turnosObtenidos = [];
    this.turnosEspecialista = [];
    this.turnosPaciente = [];
    this.especialistasObtenidos = [];
    this.pacientesObtenidos = [];
    this.historiasClinicasObtenidas = [];
    this.turnoSeleccionado = null;
    this.pacientesAtendidos = [];

    this.ObtenerEspecialistas();
    this.ObtenerPacientes();
    this.ObtenerHistoriasClinicas();
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
    const especialistasSubscription = this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
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
    const pacientesSubscription: Subscription = this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Paciente") { this.pacientesObtenidos.push(usuario); }
      }
    });

    this.subscripciones.add(pacientesSubscription);
  }
  
  ObtenerHistoriasClinicas(): void
  {
    const HistoriasClinicasSubscription: Subscription = this.firestoreService.obtenerContenidoAsObservable("historiasclinicas").subscribe(historias => {
      this.historiasClinicasObtenidas.length = 0;
      
      let dniPacientesEncontrados: string[] = [];
      for(const paciente of this.pacientesObtenidos)
      {
        for(const historia of historias)
        {
          let visitaEncontrada: boolean = false;
          for(const visita of historia.visitas) // Solo traigo las historias del especialista logueado
          {
            if(visita.dniEspecialista == this.userService.dniUsuarioLogueado && historia.dniPaciente == paciente.dni) 
            { 
              visitaEncontrada = true;
              if(visitaEncontrada && !dniPacientesEncontrados.includes(historia.dniPaciente)) 
              { 
                this.pacientesAtendidos.push(paciente); 
                dniPacientesEncontrados.push(paciente.dni)
                console.log(dniPacientesEncontrados)
              }
            }
          }
          if(visitaEncontrada) { this.historiasClinicasObtenidas.push(historia); }
        }
      }
    });

    this.subscripciones.add(HistoriasClinicasSubscription);
  }

  ObtenerTurnos(): void
  {
    this.cargandoDatos = true; 
    const turnosSubscription = this.firestoreService.obtenerContenidoAsObservable("turnos").subscribe(turnos => {
      this.turnosObtenidos.length = 0;
      this.turnosPaciente.length = 0;
      this.turnosEspecialista.length = 0;
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
              if(objetoTurnoTabla.dniEspecialista == this.userService.dniUsuarioLogueado && this.userService.rolUsuarioLogueado == "Especialista")
              {
                this.turnosEspecialista.push(objetoTurnoTabla);
              }
              else if(objetoTurnoTabla.dniPaciente == this.userService.dniUsuarioLogueado && this.userService.rolUsuarioLogueado == "Paciente")
              {
                this.turnosPaciente.push(objetoTurnoTabla);
              }
            }
          }
        }
      }
      this.cargandoDatos = false; 
      console.log(this.turnosObtenidos);
    });

    this.subscripciones.add(turnosSubscription);
  }

  AsignarTurnoSeleccionado(turno: any): void
  {
    this.turnoSeleccionado = turno;
    console.log(this.turnoSeleccionado)
  }

  ObtenerUltimosTurnos(paciente: any): string
  {
    let fechas: Date[] = []
    for(const historia of this.historiasClinicasObtenidas)
    {
      console.log(this.historiasClinicasObtenidas)
      if(historia.dniPaciente == paciente.dni)
      {
        for(const visita of historia.visitas) 
        {
          const fechaSeparada: string = visita.fechaVisita.split(" ")[1];
          const fechaParseada: string = `${fechaSeparada.split("/")[2]}-${fechaSeparada.split("/")[1]}-${parseInt(fechaSeparada.split("/")[0])+1}`
          const fechaVisita = new Date(fechaParseada)
          fechas.push(fechaVisita); 
        }
      }
    }

    fechas.sort((a,b) => b.getDate() - a.getDate());


    console.log(fechas.length)
    if(fechas.length >= 3)
    {
      return `${fechas[0].getDate()}/${fechas[0].getMonth() + 1}/${fechas[0].getFullYear()} - ${fechas[1].getDate()}/${fechas[1].getMonth() + 1}/${fechas[1].getFullYear()} - ${fechas[2].getDate()}/${fechas[2].getMonth() + 1}/${fechas[2].getFullYear()}`
    }
    else if(fechas.length == 2)
    {
      return `${fechas[0].getDate()}/${fechas[0].getMonth() + 1}/${fechas[0].getFullYear()} - ${fechas[1].getDate()}/${fechas[1].getMonth() + 1}/${fechas[1].getFullYear()}`;
    }
    else if(fechas.length == 1) 
    {
      return `${fechas[0].getDate()}/${fechas[0].getMonth() + 1}/${fechas[0].getFullYear()}`
    }
    else {return "Aún no fue atendido."};
  }

  RelacionarHistoriaClinica(dniPaciente: string | number): void
  {
    let historiaAsignada: boolean = false;
    for(const historia of this.historiasClinicasObtenidas)
    {
      if(dniPaciente == historia.dniPaciente) 
      { 
        this.historiaClinicaDetallada = historia;
        historiaAsignada = true; 
      }
    }

    if(!historiaAsignada) { this.historiaClinicaDetallada = {}; }
  }
}