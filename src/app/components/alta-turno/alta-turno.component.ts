// ===== REEMPLAZA TODO EL COMPONENTE TypeScript =====

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Turno } from '../../interfaces/ITurno';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
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
  imports: [FormsModule, CommonModule, PipesModule, ReactiveFormsModule, 
            AgrandarOnHoverDirective, DeshabilitarOnClickDirective, ResaltarOnHoverDirective]
})
export class AltaTurnoComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  swalService = inject(SweetAlertService);
  firestoreService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  cargandoDatos: boolean = true;
  
  // NUEVO FLUJO: 1. Especialista → 2. Especialidad → 3. Turno
  especialistaSeleccionado: any = null;
  especialidadSeleccionada: string = "";
  turnoSeleccionado: string = "";
  
  especialistasDisponibles: any[] = [];
  especialidadesDelEspecialista: string[] = [];
  turnosDisponibles: string[] = [];
  
  pacientesObtenidos: any[] = [];
  pacienteSeleccionado: any = null;
  
  diasDisponibles: string[] = [];
  subscripciones: Subscription = new Subscription();
  
  formPaciente!: FormGroup;
  formAdministrador!: FormGroup;

  // Mapeo de imágenes por especialidad
  imagenesEspecialidades: { [key: string]: string } = {
    'Odontologia': '/imgs/dentista.png',
    'Odontología': '/imgs/dentista.png',
    'Dermatologia': '/imgs/dermatologia.png',
    'Dermatología': '/imgs/dermatologia.png',
    'Kinesiologia': '/imgs/kinesiologo.png',
    'Kinesiología': '/imgs/kinesiologo.png',
    'Traumatologia': '/imgs/traumatologo.png',
    'Traumatología': '/imgs/traumatologo.png'
  };

  constructor() {
    this.formPaciente = this.formBuilder.group({
      especialista: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      turno: ['', [Validators.required]]
    });

    this.formAdministrador = this.formBuilder.group({
      paciente: ['', [Validators.required]],
      especialista: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      turno: ['', [Validators.required]]
    });

    this.ObtenerEspecialistas();
    this.ObtenerPacientes();
    this.ObtenerDiasDisponibles();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargandoDatos = false;
      console.log(`✅ Componente cargado. Rol: ${this.userService.rolUsuarioLogueado}`);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscripciones.unsubscribe();
  }

  // 📋 PASO 1: Obtener TODOS los especialistas habilitados
  ObtenerEspecialistas(): void {
    const sub = this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      this.especialistasDisponibles = usuarios.filter(u => 
        u.rol === "Especialista" && u.habilitado === true
      );
      console.log(`👨‍⚕️ ${this.especialistasDisponibles.length} especialistas habilitados`);
    });
    this.subscripciones.add(sub);
  }

  // 📋 Obtener pacientes (solo para Admin)
  ObtenerPacientes(): void {
    const sub = this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      this.pacientesObtenidos = usuarios.filter(u => u.rol === "Paciente");
    });
    this.subscripciones.add(sub);
  }

  // 🔹 PASO 2: Usuario selecciona un ESPECIALISTA
  SeleccionarEspecialista(especialista: any): void {
    console.log(`✅ Especialista seleccionado: ${especialista.nombre} ${especialista.apellido}`);
    
    this.especialistaSeleccionado = especialista;
    this.especialidadSeleccionada = "";
    this.turnoSeleccionado = "";
    this.turnosDisponibles = [];
    
    // Obtener las especialidades de ESTE especialista
    this.especialidadesDelEspecialista = [];
    
    if (especialista.especialidades && Array.isArray(especialista.especialidades)) {
      this.especialidadesDelEspecialista = [...especialista.especialidades];
    } else if (especialista.especialidad && typeof especialista.especialidad === 'string') {
      this.especialidadesDelEspecialista = [especialista.especialidad];
    }
    
    console.log(`📋 Especialidades disponibles:`, this.especialidadesDelEspecialista);
    
    this.formPaciente.patchValue({ especialista: especialista.dni, especialidad: '', turno: '' });
    this.formAdministrador.patchValue({ especialista: especialista.dni, especialidad: '', turno: '' });
  }

  // 🔹 PASO 3: Usuario selecciona una ESPECIALIDAD
  SeleccionarEspecialidad(especialidad: string): void {
    console.log(`✅ Especialidad seleccionada: ${especialidad}`);
    
    this.especialidadSeleccionada = especialidad;
    this.turnoSeleccionado = "";
    
    this.formPaciente.patchValue({ especialidad, turno: '' });
    this.formAdministrador.patchValue({ especialidad, turno: '' });
    
    // Generar turnos disponibles
    this.ObtenerTurnosDisponibles();
  }

  // 🔹 PASO 4: Usuario selecciona un TURNO
  SeleccionarTurno(turno: string): void {
    console.log(`✅ Turno seleccionado: ${turno}`);
    
    this.turnoSeleccionado = turno;
    
    this.formPaciente.patchValue({ turno });
    this.formAdministrador.patchValue({ turno });
  }

  // 👤 Admin selecciona paciente
  AsignarPaciente(paciente: any): void {
    console.log(`✅ Paciente seleccionado: ${paciente.nombre} ${paciente.apellido}`);
    this.pacienteSeleccionado = paciente;
    this.formAdministrador.patchValue({ paciente: paciente.dni });
  }

  // 📅 Generar 15 días hábiles (sin domingos)
  ObtenerDiasDisponibles(): void {
    this.diasDisponibles = [];
    let fecha = new Date();
    let diasAgregados = 0;
    const DIAS_MAXIMOS = 15;

    while (diasAgregados < DIAS_MAXIMOS) {
      if (fecha.getDay() !== 0) { // No es domingo
        const diaFormateado = `${this.ParsearDia(fecha.getDay())} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        this.diasDisponibles.push(diaFormateado);
        diasAgregados++;
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    
    console.log(`✅ ${this.diasDisponibles.length} días disponibles generados`);
  }

  // 🕒 Generar turnos disponibles
  ObtenerTurnosDisponibles(): void {
    this.turnosDisponibles = [];
    
    let dniPaciente: number = 0;
    if (this.userService.rolUsuarioLogueado === "Administrador") {
      if (!this.pacienteSeleccionado) {
        console.warn('⚠️ Debes seleccionar un paciente primero');
        return;
      }
      dniPaciente = this.pacienteSeleccionado.dni;
    } else {
      dniPaciente = this.userService.dniUsuarioLogueado;
    }

    const sub = this.firestoreService.obtenerContenidoAsObservable("turnos").subscribe(turnos => {
      for (const dia of this.diasDisponibles) {
        const diaIndex = this.ParsearDiaIndex(dia.split(" ")[0]);
        const horariosOcupados: string[] = [];
        
        // Buscar turnos ocupados
        for (const turno of turnos) {
          if (turno.fecha === dia && 
              (turno.dniPaciente == dniPaciente || turno.dniEspecialista == this.especialistaSeleccionado.dni) && 
              turno.estado !== "Cancelado") {
            horariosOcupados.push(turno.horario);
          }
        }

        // Generar horarios según día
        const horarios = dia.split(" ")[0] === "Sábado"
          ? ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"]
          : ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", 
             "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];

        for (const horario of horarios) {
          if (!horariosOcupados.includes(horario) && 
              this.especialistaSeleccionado.horariosDisponibles &&
              this.especialistaSeleccionado.horariosDisponibles[diaIndex] &&
              horario >= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[0] && 
              horario <= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[1]) {
            
            // Formato: "2021-09-09 1:15 PM"
            const [year, month, day] = dia.split(" ")[1].split("/").reverse();
            const [hora, minutos] = horario.split(":");
            const horaNum = parseInt(hora);
            const ampm = horaNum >= 12 ? "PM" : "AM";
            const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
            
            const turnoFormateado = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hora12}:${minutos} ${ampm}`;
            this.turnosDisponibles.push(turnoFormateado);
          }
        }
      }
      
      console.log(`✅ ${this.turnosDisponibles.length} turnos disponibles`);
    });

    this.subscripciones.add(sub);
  }

  // 💾 Guardar turno
  SolicitarTurno(): void {
    try {
      let dniPaciente: number = 0;
      if (this.userService.rolUsuarioLogueado === "Administrador") {
        dniPaciente = this.pacienteSeleccionado.dni;
      } else {
        dniPaciente = this.userService.dniUsuarioLogueado;
      }

      // Convertir formato de fecha de vuelta
      const [fechaParte, horaParte] = this.turnoSeleccionado.split(" ");
      const [year, month, day] = fechaParte.split("-");
      const hora24 = this.Convertir12a24(horaParte);
      
      const diaLargo = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const fechaFinal = `${this.ParsearDia(diaLargo.getDay())} ${day}/${month}/${year}`;

      const objetoTurno: Turno = {
        dniEspecialista: this.especialistaSeleccionado.dni,
        dniPaciente: dniPaciente.toString(),
        fecha: fechaFinal,
        horario: hora24,
        estado: "Pendiente",
        mensajeEstado: "",
        valoracionConsulta: 0,
        comentarioValoracion: "",
        especialidadSeleccionada: this.especialidadSeleccionada
      };

      console.log('💾 Guardando turno:', objetoTurno);

      this.firestoreService.GuardarContenido("turnos", objetoTurno);
      this.swalService.LanzarAlert("Turno agendado exitosamente!", "success", "El turno fue agendado y queda a la espera.");
      
      // Resetear
      this.especialistaSeleccionado = null;
      this.especialidadSeleccionada = "";
      this.turnoSeleccionado = "";
      this.pacienteSeleccionado = null;
      this.turnosDisponibles = [];
      this.especialidadesDelEspecialista = [];
      this.formPaciente.reset();
      this.formAdministrador.reset();
    } catch (error) {
      console.error('❌ Error:', error);
      this.swalService.LanzarAlert("Error al agendar", "error", `${error}`);
    }
  }

  // Helpers
  ParsearDia(dia: number): string {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[dia];
  }

  ParsearDiaIndex(diaNombre: string): number {
    const indices: { [key: string]: number } = {
      "Lunes": 0, "Martes": 1, "Miércoles": 2, "Jueves": 3, "Viernes": 4, "Sábado": 5
    };
    return indices[diaNombre] ?? -1;
  }

  Convertir12a24(hora12: string): string {
    const [tiempo, periodo] = hora12.split(" ");
    let [hora, minutos] = tiempo.split(":").map(Number);
    
    if (periodo === "PM" && hora !== 12) hora += 12;
    if (periodo === "AM" && hora === 12) hora = 0;
    
    return `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  ObtenerImagenEspecialidad(especialidad: string): string {
    return this.imagenesEspecialidades[especialidad] || '/imgs/otros.png';
  }
}