import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
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
  encapsulation: ViewEncapsulation.None,
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
      especialista: ['', [Validators.required]],
      dia: ['', [Validators.required]],
      horario: ['', [Validators.required]],
    });

    this.formAdministrador = this.formBuilder.group({
      paciente: ['', [Validators.required]],
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
      this.cargandoDatos = false;
      console.log(`rolusuariologueado ${this.userService.rolUsuarioLogueado}`)
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscripciones.unsubscribe();
  }

  /**
   * 🔧 ACTUALIZADO: Ahora obtiene especialidades de un array en lugar de un string único
   * Recorre todos los especialistas y extrae todas sus especialidades únicas
   */
  ObtenerEspecialidades(): void
  {
    console.log('📋 Obteniendo especialidades de especialistas...');
    
    // Limpiar el array antes de llenarlo
    this.especialidadesDisponibles = [];
    
    for(const especialista of this.especialistasObtenidos) 
    { 
      // Verificar si el especialista tiene el campo especialidades y es un array
      if(especialista.especialidades && Array.isArray(especialista.especialidades))
      {
        // Recorrer cada especialidad del array
        for(const especialidad of especialista.especialidades)
        {
          // Solo agregar si no existe ya en la lista
          if(!this.especialidadesDisponibles.includes(especialidad)) 
          { 
            this.especialidadesDisponibles.push(especialidad); 
            console.log(`✅ Especialidad agregada: ${especialidad}`);
          }
        }
      }
      // COMPATIBILIDAD: Si el especialista tiene el formato antiguo (string)
      else if(especialista.especialidad && typeof especialista.especialidad === 'string')
      {
        if(!this.especialidadesDisponibles.includes(especialista.especialidad)) 
        { 
          this.especialidadesDisponibles.push(especialista.especialidad); 
          console.log(`✅ Especialidad agregada (formato antiguo): ${especialista.especialidad}`);
        }
      }
    }
    
    console.log('📊 Especialidades disponibles:', this.especialidadesDisponibles);
  }

  ObtenerEspecialistas(): void
  {
    this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      // Limpiar array antes de llenar
      this.especialistasObtenidos = [];
      
      for(const usuario of usuarios)
      {
        // Solo agregar especialistas habilitados
        if(usuario.rol == "Especialista" && usuario.habilitado === true) 
        { 
          this.especialistasObtenidos.push(usuario); 
        }
      }
      
      console.log(`👨‍⚕️ Especialistas habilitados obtenidos: ${this.especialistasObtenidos.length}`);
      this.ObtenerEspecialidades();
    });
  }

  ObtenerPacientes(): void
  {
    this.firestoreService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      // Limpiar array antes de llenar
      this.pacientesObtenidos = [];
      
      for(const usuario of usuarios)
      {
        if(usuario.rol == "Paciente") { this.pacientesObtenidos.push(usuario); }
      }
    });
  }

  /**
   * 🔧 ACTUALIZADO: Ahora busca la especialidad en el array especialidades[]
   * en lugar de comparar con un string único
   */
  ObtenerEspecialistasDisponibles(especialidadIngresada: string): void
  {
    console.log(`🔍 Buscando especialistas para: ${especialidadIngresada}`);
    
    this.especialistasDisponibles = [];
    this.diaSeleccionado = "";
    this.horarioSeleccionado = "";
    this.formPaciente.patchValue({dia: "", horario: ""});
    this.formAdministrador.patchValue({dia: "", horario: ""});
    
    for(const especialista of this.especialistasObtenidos)
    {
      // NUEVO: Verificar si la especialidad está en el array
      if(especialista.especialidades && Array.isArray(especialista.especialidades))
      {
        if(especialista.especialidades.includes(especialidadIngresada))
        {
          this.especialistasDisponibles.push(especialista);
          console.log(`✅ Especialista encontrado: ${especialista.nombre} ${especialista.apellido}`);
        }
      }
      // COMPATIBILIDAD: Formato antiguo (string)
      else if(especialista.especialidad === especialidadIngresada)
      {
        this.especialistasDisponibles.push(especialista);
        console.log(`✅ Especialista encontrado (formato antiguo): ${especialista.nombre} ${especialista.apellido}`);
      }
    }
    
    console.log(`📊 Total especialistas disponibles: ${this.especialistasDisponibles.length}`);
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
      let btnEspecialista = btnEspecialistas.item(i) as HTMLElement;
      if(btnEspecialista){ btnEspecialista.style.backgroundColor = "#ffffff00"; }
    }
    
    if(btnEspecialistaSeleccionado) {
      btnEspecialistaSeleccionado.style.backgroundColor = "#55ddffd7"
    }
    
    console.log(`✅ Especialista seleccionado: ${especialistaSeleccionado.nombre} ${especialistaSeleccionado.apellido}`);
  }

  AsignarPaciente(pacienteSeleccionado: any)
  {
    this.formAdministrador.patchValue({paciente: pacienteSeleccionado.dni});
    this.pacienteSeleccionado = pacienteSeleccionado;
    this.horarioSeleccionado = "";
    this.diaSeleccionado = "";
    console.log(`✅ Paciente seleccionado: ${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`);
  }

  /**
   * 🔧 ACTUALIZADO: Ahora genera exactamente 15 días hábiles (sin domingos)
   * y valida que no se generen más días de los necesarios
   */
  ObtenerDiasDisponibles(): void
  {
    this.diasDisponibles = [];
    let fecha: Date = new Date();
    const DIAS_MAXIMOS = 15; // 📌 Límite de 15 días
    let diasAgregados = 0;

    console.log(`📅 Generando ${DIAS_MAXIMOS} días disponibles desde ${fecha.toLocaleDateString()}`);

    // Seguir agregando hasta tener exactamente 15 días hábiles
    while(diasAgregados < DIAS_MAXIMOS) 
    {
      // Solo agregar si NO es domingo (día 0)
      if(fecha.getDay() !== 0) 
      { 
        const diaFormateado = `${this.ParsearDia(fecha.getDay())} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        this.diasDisponibles.push(diaFormateado);
        diasAgregados++;
        console.log(`📆 Día ${diasAgregados}: ${diaFormateado}`);
      }
      
      // Avanzar al siguiente día
      fecha.setDate(fecha.getDate() + 1);
    }
    
    console.log(`✅ Total días disponibles generados: ${this.diasDisponibles.length}`);
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
  
  /**
   * 🔧 MEJORADO: Agregados más logs para debugging
   * Valida que solo se muestren turnos dentro de los 15 días disponibles
   */
  ObtenerTurnosDisponibles(): void
  {
    this.turnosDisponibles = [];

    let dni: number = 0;
    let horariosNoDisponibles: string[] = [];
    let horarios: string[] = [];

    if(this.userService.rolUsuarioLogueado == "Administrador") { dni = this.pacienteSeleccionado.dni; }
    else if(this.userService.rolUsuarioLogueado == "Paciente") { dni = this.userService.dniUsuarioLogueado; }

    console.log(`🔍 Obteniendo turnos disponibles para DNI: ${dni}`);
    console.log(`👨‍⚕️ Especialista: ${this.especialistaSeleccionado.nombre}`);
    console.log(`📅 Días disponibles (${this.diasDisponibles.length}):`, this.diasDisponibles);

    const subTurnos: Subscription = this.firestoreService.obtenerContenidoAsObservable("turnos").subscribe(turnos => {
      if(this.diasDisponibles && this.especialistaSeleccionado)
      {
        // Recorrer SOLO los 15 días disponibles
        for(const dia of this.diasDisponibles)
        {
          const diaIndex = this.ParsearDiaIndex(dia.split(" ")[0]);
          horariosNoDisponibles = []; // Limpiar para cada día
          
          // Buscar turnos ocupados para este día específico
          for(const turno of turnos)
          {
            if(turno.fecha == dia && 
               (turno.dniPaciente == dni || turno.dniEspecialista == this.especialistaSeleccionado.dni) && 
               turno.estado != "Cancelado")
            {
              console.log(`❌ Turno ocupado: ${dia} ${turno.horario}`);
              horariosNoDisponibles.push(turno.horario);
            }
          }

          // Generar horarios según el día de la semana
          if(dia.split(" ")[0] == "Sábado")
          {
            horarios = [ "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00" ];
            
            for(const horario of horarios)
            {
              if(!horariosNoDisponibles.includes(horario) && 
                 this.especialistaSeleccionado.horariosDisponibles &&
                 this.especialistaSeleccionado.horariosDisponibles[5] &&
                 horario >= this.especialistaSeleccionado.horariosDisponibles[5].split("-")[0] && 
                 horario <= this.especialistaSeleccionado.horariosDisponibles[5].split("-")[1]) 
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
              if(!horariosNoDisponibles.includes(horario) && 
                 this.especialistaSeleccionado.horariosDisponibles &&
                 this.especialistaSeleccionado.horariosDisponibles[diaIndex] &&
                 horario >= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[0] && 
                 horario <= this.especialistaSeleccionado.horariosDisponibles[diaIndex].split("-")[1]) 
              { 
                const diaParseado = dia.split(" ")[1].split("/")[0] + "/" + dia.split(" ")[1].split("/")[1]
                this.turnosDisponibles.push(diaParseado + " " + horario); 
              }
            }
          }
        }
        
        console.log(`✅ Total turnos disponibles generados: ${this.turnosDisponibles.length}`);
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
        
        console.log(`✅ Turno asignado: ${dia} ${this.horarioSeleccionado}`);
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
        comentarioValoracion: "",
        especialidadSeleccionada: this.especialidadSeleccionada,
      };

      console.log('💾 Guardando turno:', objetoTurno);

      this.firestoreService.GuardarContenido("turnos", objetoTurno);
      this.swalService.LanzarAlert("Turno agendado exitosamente!", "success", "El turno fue agendado y queda a la espera de la aprobación por parte del especialista. Puedes ver tu turno en la sección 'Mis turnos'!");
      
      // Resetear formularios y variables
      this.formPaciente.reset();
      this.formAdministrador.reset();
      this.diaSeleccionado = "";
      this.horarioSeleccionado = "";
      this.pacienteSeleccionado = null;
      this.especialistaSeleccionado = null;
      this.especialidadSeleccionada = "";
      
      // Limpiar estilos de botones
      let btnEspecialistas: HTMLCollectionOf<Element> = document.getElementsByClassName("btn-especialistas");
      for(let i = 0; i < btnEspecialistas.length; i++)
      {
        let btnEspecialista = btnEspecialistas.item(i) as HTMLElement;
        if(btnEspecialista){ btnEspecialista.style.backgroundColor = "#ffffff00"; }
      }
    }
    catch(error) { 
      console.error('❌ Error al agendar turno:', error);
      this.swalService.LanzarAlert("Error al agendar el turno", "error", `${error}`); 
    }
  }
}