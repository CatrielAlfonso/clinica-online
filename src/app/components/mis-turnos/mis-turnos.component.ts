import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService, authResponse } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Turno } from '../../interfaces/ITurno';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { UserService } from '../../services/user.service';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';
import { AngularMaterialModule } from '../../modules/pipes/angular-material/angular-material.module';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.scss',
  imports:[CommonModule, FormsModule, PipesModule, MatSliderModule, MatSlideToggle]
})
export class MisTurnosComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  swalService = inject(SweetAlertService);
  authService = inject(AuthService);
  storageService = inject(SupabaseStorageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  Object = Object;
  cargandoDatos: boolean;
  procesandoFinalizacion: boolean = false;

  subscripciones: Subscription = new Subscription();
  subscripcionObtenerTurnos = new Subscription()

  rating = 5;
  hover = 0;
  stars: number[] = Array(10);

  rangoDinamico: number = 50;
  numeroDinamico: number | null = null;
  switchDinamico: boolean = false;

  formatLabel(value: number): string {
    return `${value}`;
  }

  onSliderChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.rating = parseInt(target.value);
  }

  setRating(value: number) {
    this.rating = value;
  }

  turnosObtenidos: any[];
  turnosEspecialista: any[];
  turnosPaciente: any[];
  especialistasObtenidos: any[];
  historiasClinicasObtenidas: any[];
  historiaClinicaDetallada: any = {};
  especialistasObtenidosBackup: any[] = [];
  turnosObtenidosBackup: any[] = [];
  turnosObtenidosPacienteBackup: any[] = [];
  turnosObtenidosEspecialistaBackup: any[] = [];
  pacientesBackup: any[] = [];
  filtroGeneral: string = "";
  pacientesAtendidos: string[];
  pacientesObtenidos: any[];
  filtroEspecialidad: string;
  filtroEspecialista: string;
  filtroPaciente: string;  

  turnoSeleccionado: any;
  mensajeEstado: string;
  mensajeResenia: string;

  especialidadSeleccionada: string = "";
  alturaPaciente: number | null;
  pesoPaciente: number | null;
  temperaturaPaciente: number | null;
  presionPaciente: number | null;
  diagnosticoPaciente: string;
  detalleDiagnosticoPaciente: string;

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
    this.filtroEspecialidad = "";
    this.filtroEspecialista = "";
    this.filtroPaciente = "";
    this.turnoSeleccionado = null;
    this.mensajeEstado = "";
    this.mensajeResenia = "";
    this.especialidadSeleccionada= "";
    this.alturaPaciente = null;
    this.pesoPaciente = null;
    this.temperaturaPaciente = null;
    this.presionPaciente = null;
    this.diagnosticoPaciente = "";
    this.detalleDiagnosticoPaciente = "";
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

  ngOnDestroy(): void 
  {
    this.subscripciones.unsubscribe();
  }

  ActualizarEstadosTurnos(): void
  {
    this.ObtenerTurnos();
  }

  ObtenerEspecialistas(): void
  {
    this.especialistasObtenidos.length = 0;
    const especialistasSubscription = this.authService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Especialista") 
        { 
          this.especialistasObtenidos.push(usuario); 
          this.especialistasObtenidosBackup.push(usuario); 
        }
      }
    });

    this.subscripciones.add(especialistasSubscription);
  }

  ObtenerPacientes(): void
  {
    this.pacientesObtenidos.length = 0;
    this.pacientesBackup.length = 0;
    
    const pacientesSubscription: Subscription = this.authService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
     const pacientes = usuarios.filter(usuario => usuario.rol === "Paciente");

      this.pacientesObtenidos = [...pacientes];
      this.pacientesBackup = [...pacientes];

      this.cargandoDatos = false;
    });

    this.subscripciones.add(pacientesSubscription);
  }
  
  ObtenerHistoriasClinicas(): void
  {
    const HistoriasClinicasSubscription: Subscription = this.authService.obtenerContenidoAsObservable("historiasclinicas").subscribe(historias => {
      this.historiasClinicasObtenidas.length = 0;
      for(const historia of historias)
      {
        this.historiasClinicasObtenidas.push(historia);
      }
    });

    this.subscripciones.add(HistoriasClinicasSubscription);
  }

  ObtenerTurnos(): void
  {
    const turnosSubscription = this.authService.obtenerContenidoAsObservable("turnos").subscribe(turnos => {
      this.turnosObtenidos = [];
      this.turnosPaciente = [];
      this.turnosEspecialista = [];
      this.turnosObtenidosBackup = [];
      this.turnosObtenidosPacienteBackup = [];
      this.turnosObtenidosEspecialistaBackup = [];
      
      for(const turno of turnos)
      {
        for(const especialista of this.especialistasObtenidos)
        {
          for(const paciente of this.pacientesObtenidos)
          {
            if(turno.dniEspecialista == especialista.dni && turno.dniPaciente == paciente.dni)
            {
              const especialidad = turno.especialidadSeleccionada || turno.especialidadEspecialista || especialista.especialidad;
              
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
                especialidadEspecialista: especialidad,
                especialidadSeleccionada: especialidad,
                imagenPerfilEspecialista: turno.imagenEspecialista,
                imagen1: especialista.imagen1,
                nombrePaciente: paciente.nombre,
                apellidoPaciente: paciente.apellido,
                imagen1Paciente: paciente.imagen1,
                imagen2Paciente: paciente.imagen2,
                historiaClinica: ""
              }

              for(const historia of this.historiasClinicasObtenidas)
              {
                if(historia.dniPaciente == turno.dniPaciente) { 
                  objetoTurnoTabla.historiaClinica = historia;
                }
              }

              this.turnosObtenidos.push(objetoTurnoTabla);
              if(objetoTurnoTabla.dniEspecialista == this.userService.dniUsuarioLogueado && this.userService.rolUsuarioLogueado == "Especialista")
              {
                this.turnosEspecialista.push(objetoTurnoTabla);
                this.turnosObtenidosEspecialistaBackup.push(objetoTurnoTabla);
              }
              else if(objetoTurnoTabla.dniPaciente == this.userService.dniUsuarioLogueado && this.userService.rolUsuarioLogueado == "Paciente")
              {
                this.turnosPaciente.push(objetoTurnoTabla);
                this.turnosObtenidosPacienteBackup.push(objetoTurnoTabla);
              }
            }
          }
        }
      }

      this.cargandoDatos = false;
      this.cdr.detectChanges();
    });

    this.subscripcionObtenerTurnos.add(turnosSubscription);
  }

  private normalizar = (txt: string) =>
    txt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  Filtrar(filtroIngresado: string): void {
    const textoNormalizado = this.normalizar(filtroIngresado);

    if (!textoNormalizado) {
      this.turnosPaciente = [...this.turnosObtenidosPacienteBackup];
      this.turnosEspecialista = [...this.turnosObtenidosEspecialistaBackup];
      return;
    }

    if (this.turnosObtenidosPacienteBackup.length > 0) {
      this.turnosPaciente = this.turnosObtenidosPacienteBackup.filter(turno => {
        const campos = [
          turno.fecha,
          turno.horario,
          turno.nombreEspecialista,
          turno.apellidoEspecialista,
          turno.especialidadEspecialista,
          turno.estado,
          turno.mensajeEstado || ''
        ].map(campo => this.normalizar(String(campo)));

        return campos.some(campo => campo.includes(textoNormalizado));
      });
    }

    if (this.turnosObtenidosEspecialistaBackup.length > 0) {
      this.turnosEspecialista = this.turnosObtenidosEspecialistaBackup.filter(turno => {
        const campos = [
          turno.fecha,
          turno.horario,
          turno.nombrePaciente,
          turno.apellidoPaciente,
          String(turno.dniPaciente),
          turno.estado,
          turno.mensajeEstado || ''
        ].map(campo => this.normalizar(String(campo)));

        return campos.some(campo => campo.includes(textoNormalizado));
      });
    }
  }

  FiltrarEspecialistas(filtroIngresado: string): void {
    const textoNormalizado = this.normalizar(filtroIngresado);

    if (!textoNormalizado) {
      this.especialistasObtenidos = [...this.especialistasObtenidosBackup];
      this.ObtenerTurnos();
      return;
    }

    this.especialistasObtenidos = this.especialistasObtenidosBackup.filter(especialista => {
      const nombreCompleto = this.normalizar(`${especialista.nombre} ${especialista.apellido}`);
      return nombreCompleto.includes(textoNormalizado);
    });

    if (this.subscripcionObtenerTurnos && !this.subscripcionObtenerTurnos.closed) {
      this.subscripcionObtenerTurnos.unsubscribe();
      this.subscripcionObtenerTurnos = new Subscription();
    }

    this.ObtenerTurnos();
  }

  FiltrarEspecialidades(filtroIngresado: string): void {
    const textoNormalizado = this.normalizar(filtroIngresado);

    if (!textoNormalizado) {
      this.especialistasObtenidos = [...this.especialistasObtenidosBackup];
      this.ObtenerTurnos();
      return;
    }

    this.especialistasObtenidos = this.especialistasObtenidosBackup.filter(especialista => {
      const especialidadNormalizada = this.normalizar(especialista.especialidad || '');
      return especialidadNormalizada.includes(textoNormalizado);
    });

    if (this.subscripcionObtenerTurnos && !this.subscripcionObtenerTurnos.closed) {
      this.subscripcionObtenerTurnos.unsubscribe();
      this.subscripcionObtenerTurnos = new Subscription();
    }

    this.ObtenerTurnos();
  }

  FiltrarPacientes(filtroIngresado: string): void {
    const textoNormalizado = this.normalizar(filtroIngresado);

    if (!textoNormalizado) {
      this.pacientesObtenidos = [...this.pacientesBackup];
      this.ObtenerTurnos();
      return;
    }

    this.pacientesObtenidos = this.pacientesBackup.filter(paciente => {
      const nombreCompleto = this.normalizar(`${paciente.nombre} ${paciente.apellido}`);
      return nombreCompleto.includes(textoNormalizado);
    });

    this.ObtenerTurnos();
  }

  async CancelarTurno(turno: any, mensajeEstadoIngresado: string): Promise<void>
  {
    const objetoTurnoNuevo: Turno = {
      dniEspecialista: turno.dniEspecialista,
      dniPaciente: turno.dniPaciente,
      fecha: turno.fecha,
      horario: turno.horario,
      estado: "Cancelado",
      mensajeEstado: "Turno cancelado por: " + this.userService.rolUsuarioLogueado + " " + mensajeEstadoIngresado,
      comentarioValoracion: turno.comentarioValoracion || "",
      valoracionConsulta: turno.valoracionConsulta || 0,
      especialidadSeleccionada: turno.especialidadSeleccionada
    }
    
    await this.authService.modificarContenido("turnos", turno.id, objetoTurnoNuevo);
    this.mensajeEstado = "";
    
    turno.estado = "Cancelado";
    turno.mensajeEstado = objetoTurnoNuevo.mensajeEstado;
    this.cdr.detectChanges();
    
    this.cerrarModal('modalCancelarTurnoPaciente');
    this.cerrarModal('modalCancelarTurnoEspecialista');
  }

  async AceptarTurno(turno: any, mensajeEstadoIngresado: string): Promise<void>
  {
    const objetoTurnoNuevo: Turno = {
      dniEspecialista: turno.dniEspecialista,
      dniPaciente: turno.dniPaciente,
      fecha: turno.fecha,
      horario: turno.horario,
      estado: "Aceptado",
      mensajeEstado: mensajeEstadoIngresado,
      comentarioValoracion: turno.comentarioValoracion || "",
      valoracionConsulta: turno.valoracionConsulta || 0,
      especialidadSeleccionada: turno.especialidadSeleccionada
    }

    await this.authService.modificarContenido("turnos", turno.id, objetoTurnoNuevo);
    this.mensajeEstado = "";
    
    turno.estado = "Aceptado";
    turno.mensajeEstado = mensajeEstadoIngresado;
    this.cdr.detectChanges();
    
    this.cerrarModal('modalAceptarTurnoEspecialista');
  }

  async RechazarTurno(turno: any, mensajeEstadoIngresado: string): Promise<void>
  {
    const objetoTurnoNuevo: Turno = {
      dniEspecialista: turno.dniEspecialista,
      dniPaciente: turno.dniPaciente,
      fecha: turno.fecha,
      horario: turno.horario,
      estado: "Rechazado",
      mensajeEstado: mensajeEstadoIngresado,
      comentarioValoracion: turno.comentarioValoracion || "",
      valoracionConsulta: turno.valoracionConsulta || 0,
      especialidadSeleccionada: turno.especialidadSeleccionada
    }

    await this.authService.modificarContenido("turnos", turno.id, objetoTurnoNuevo);
    this.mensajeEstado = "";
    
    turno.estado = "Rechazado";
    turno.mensajeEstado = mensajeEstadoIngresado;
    this.cdr.detectChanges();
  }

  AsignarTurnoSeleccionado(turno: any): void
  {
    this.turnoSeleccionado = turno;
    this.rating = 5;
    this.mensajeResenia = "";
    
    this.mensajeEstado = "";
    this.alturaPaciente = null;
    this.pesoPaciente = null;
    this.temperaturaPaciente = null;
    this.presionPaciente = null;
    this.diagnosticoPaciente = "";
    this.detalleDiagnosticoPaciente = "";
    this.rangoDinamico = 50;
    this.numeroDinamico = null;
    this.switchDinamico = false;
  }

  async FinalizarTurno(turno: any, mensaje: string): Promise<void>
  {
    if(this.procesandoFinalizacion) {
      return;
    }

    if(turno.estado !== "Aceptado") {
      this.swalService.showTemporaryAlert(
        "Este turno ya fue finalizado o no está en estado Aceptado", 
        "Error",
        "error"
      );
      return;
    }

    if(!this.alturaPaciente || !this.pesoPaciente || !this.temperaturaPaciente || 
       !this.presionPaciente || !this.diagnosticoPaciente || !this.detalleDiagnosticoPaciente) {
      this.swalService.showTemporaryAlert(
        "Por favor complete todos los campos obligatorios", 
        "Campos incompletos",
        "warning"
      );
      return;
    }

    this.procesandoFinalizacion = true;
    
    try {
      const especialidadActual = turno.especialidadSeleccionada;
      let crearHistoriaClinica: boolean = true;

      for(const paciente of this.pacientesObtenidos) 
      {
        if(paciente.dni == turno.dniPaciente)
        {
          for(const especialista of this.especialistasObtenidos)
          {
            if(especialista.dni == turno.dniEspecialista)
            {
              // CAMBIO PRINCIPAL: Crear objeto con datos dinámicos en formato clave-valor
              const datosDinamicos: any = {};
              
              if (this.rangoDinamico !== undefined && this.rangoDinamico !== null) {
                datosDinamicos['Nivel de Severidad'] = {
                  valor: this.rangoDinamico,
                  unidad: '/100',
                  tipo: 'rango'
                };
              }
              
              if (this.numeroDinamico !== undefined && this.numeroDinamico !== null) {
                datosDinamicos['Frecuencia Cardíaca'] = {
                  valor: this.numeroDinamico,
                  unidad: 'ppm',
                  tipo: 'numero'
                };
              }
              
              if (this.switchDinamico !== undefined) {
                datosDinamicos['Requiere Seguimiento'] = {
                  valor: this.switchDinamico ? 'Sí' : 'No',
                  unidad: '',
                  tipo: 'booleano'
                };
              }

              const objetoHistoriaClinica: any = {
                especialidadVisitada: especialidadActual,
                nombreEspecialista: especialista.nombre,
                apellidoEspecialista: especialista.apellido,
                dniEspecialista: especialista.dni,
                fechaVisita: turno.fecha,
                horarioVisita: turno.horario,
                alturaPaciente: this.alturaPaciente,
                pesoPaciente: this.pesoPaciente,
                temperaturaPaciente: this.temperaturaPaciente,
                presionPaciente: this.presionPaciente,
                diagnosticoPaciente: this.diagnosticoPaciente,
                detalleDiagnosticoPaciente: this.detalleDiagnosticoPaciente,
                datosDinamicos: datosDinamicos // Guardar como objeto clave-valor
              }
              
              let historiaExistente: any = {}
              for(const historia of this.historiasClinicasObtenidas)
              {
                if(historia.dniPaciente == paciente.dni) { 
                  crearHistoriaClinica = false;
                  historiaExistente = historia; 
                }
              }
      
              if(crearHistoriaClinica) 
              {
                const nuevaHistoriaClinica: any = {
                  nombrePaciente: `${paciente.nombre} ${paciente.apellido}`,
                  edadPaciente: paciente.edad, 
                  dniPaciente: paciente.dni,
                  visitas: [ objetoHistoriaClinica ] 
                }

                await this.authService.GuardarContenido("historiasclinicas", nuevaHistoriaClinica);
              }
              else
              {
                const historiaClinicaModificada: any = {
                  nombrePaciente: historiaExistente.nombrePaciente,
                  edadPaciente: historiaExistente.edadPaciente, 
                  dniPaciente: historiaExistente.dniPaciente,
                  visitas: [ 
                    ...historiaExistente.visitas, 
                    objetoHistoriaClinica
                  ]
                }

                await this.authService.modificarContenido("historiasclinicas", historiaExistente.id, historiaClinicaModificada);
              }
            }
          }
        }
      }

      const objetoTurnoNuevo: Turno = {
        dniEspecialista: turno.dniEspecialista,
        dniPaciente: turno.dniPaciente,
        fecha: turno.fecha,
        horario: turno.horario,
        estado: "Finalizado",
        mensajeEstado: mensaje,
        valoracionConsulta: turno.valoracionConsulta || 0,
        comentarioValoracion: turno.comentarioValoracion || "",
        especialidadSeleccionada: especialidadActual
      }
      
      await this.authService.modificarContenido("turnos", turno.id, objetoTurnoNuevo);

      turno.estado = "Finalizado";
      turno.mensajeEstado = mensaje;

      this.mensajeEstado = "";
      this.alturaPaciente = null;
      this.pesoPaciente = null;
      this.temperaturaPaciente = null;
      this.presionPaciente = null;
      this.diagnosticoPaciente = "";
      this.detalleDiagnosticoPaciente = "";
      this.rangoDinamico = 50;
      this.numeroDinamico = null;
      this.switchDinamico = false;
      
      this.cdr.detectChanges();
      
      this.swalService.showTemporaryAlert("Turno finalizado correctamente", "Finalizado", "success");
      
      this.cerrarModal('modalFinalizarTurno');
      
    } catch (error) {
      console.error("Error al finalizar turno:", error);
      this.swalService.showTemporaryAlert(
        "Ocurrió un error al finalizar el turno", 
        "Error",
        "error"
      );
    } finally {
      this.procesandoFinalizacion = false;
    }
  }

  async GuardarValoracionUsuario(turno: any, comentario: string): Promise<void>
  {
    const objetoTurnoNuevo: Turno = {
      dniEspecialista: turno.dniEspecialista,
      dniPaciente: turno.dniPaciente,
      fecha: turno.fecha,
      horario: turno.horario,
      estado: "Finalizado",
      mensajeEstado: turno.mensajeEstado,
      valoracionConsulta: this.rating,
      comentarioValoracion: comentario,
      especialidadSeleccionada: turno.especialidadSeleccionada
    }
    
    await this.authService.modificarContenido("turnos", turno.id, objetoTurnoNuevo);
    
    turno.valoracionConsulta = this.rating;
    turno.comentarioValoracion = comentario;
    
    this.mensajeResenia = "";
    this.rating = 5;
    
    this.cdr.detectChanges();
    
    this.swalService.showTemporaryAlert("Valoración guardada correctamente", "Guardado","success");
    this.cerrarModal('modalCalificarAtencion');
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

  obtenerCamposDinamicos(datosDinamicos: any): any[] {
    if (!datosDinamicos) return [];
    
    return Object.keys(datosDinamicos).map(clave => ({
      clave: clave,
      valor: datosDinamicos[clave].valor,
      unidad: datosDinamicos[clave].unidad,
      tipo: datosDinamicos[clave].tipo
    }));
  }

  private cerrarModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalBackdrop = document.querySelector('.modal-backdrop');
      
      const modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
}