import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../modules/pipes/angular-material/angular-material.module';
import { AuthService, authResponse } from '../../services/auth.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { SupabaseStorageService } from '../../services/supabase-storage.service';
import { SupabaseService } from '../../services/supabase.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CaptchaDirective } from '../../directives/captcha.directive';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-registro',
  imports: [FormsModule,CommonModule, AngularMaterialModule, ReactiveFormsModule, RecaptchaModule, RouterLink, MatCheckboxModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  authService = inject(AuthService);
  swalService = inject(SweetAlertService);
  supabaseService = inject(SupabaseService);
  storageService = inject(SupabaseStorageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  tipoUsuario: "Paciente" | "Especialista" | "";
  subiendoDatos: boolean;
  formPaciente!: FormGroup;
  formEspecialista!: FormGroup;
  archivoImagen1?: File;
  archivoImagen2?: File;
  archivoImagenPerfil?: File;
  mensajeImagen1: string;
  mensajeImagen2: string;
  mensajeImagenPerfil: string;
  
  // URLs para vista previa
  vistaPrevia1?: string;
  vistaPrevia2?: string;
  vistaPreviaEspecialista?: string;
  token: string|undefined;

  especialidadesDisponibles: string[] = [
    'Dermatología',
    'Traumatología',
    'Odontología',
    'Kinesiología',
  ];
  
  especialidadesPersonalizadas: string[] = [];
  nuevaEspecialidad: string = '';

  //--- ReCaptchaV2 (Traido de tesys) ---//
  captchaResponse:any = null;
  captchaOK = false;


  constructor() 
  {
    this.tipoUsuario = "";
    this.token = undefined;
    this.subiendoDatos = false;
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      edad: ['', [Validators.required, Validators.max(99), Validators.pattern(/^[0-9]\d*$/)]],
      dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern(/^[0-9]\d*$/)]],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required,]], 
      clave: ['', [Validators.required,]], 
      imagen1: [null, [Validators.required,]], 
      imagen2: [null, [Validators.required,]], 
    });

    this.formEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65), Validators.pattern(/^[0-9]\d*$/)]],
      dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern(/^[0-9]\d*$/)]],
      especialidad: [[], Validators.required],
      email: ['', [Validators.required,]], 
      clave: ['', [Validators.required,]], 
      imagen1: [null, [Validators.required,]] 
    });
    
    this.mensajeImagen1 = "Haga click para subir la imagen 1."
    this.mensajeImagen2 = "Haga click para subir la imagen 2."
    this.mensajeImagenPerfil = "Haga click para subir su imagen de perfil."
  }

  toggleEspecialidad(nombre: string, checked: boolean) {
    // Obtenemos el array actual
    const especialidades = [...(this.formEspecialista.get('especialidad')!.value as string[])];

    if (checked) {
      // Agregar si no existe
      if (!especialidades.includes(nombre)) {
        especialidades.push(nombre);
      }
    } else {
      // Quitar si existe
      const index = especialidades.indexOf(nombre);
      if (index !== -1) {
        especialidades.splice(index, 1);
      }
    }
    
    // Actualizar el FormControl
    this.formEspecialista.get('especialidad')!.setValue(especialidades);
    
    // Marcar como touched para activar validaciones
    this.formEspecialista.get('especialidad')!.markAsTouched();
    
    console.log('Especialidades actuales:', especialidades);
  }

  agregarNuevaEspecialidad() {
    const nueva = this.nuevaEspecialidad.trim();

    if (!nueva) return;

    // Obtenemos el array actual del FormControl
    const especialidades = [...(this.formEspecialista.get('especialidad')!.value as string[])];

    // Verificamos que no exista ya en el FormControl
    if (!especialidades.includes(nueva)) {
      // 1. Agregar al FormControl
      especialidades.push(nueva);
      this.formEspecialista.get('especialidad')!.setValue(especialidades);
      
      // 2. Agregar a las personalizadas SOLO si no está ya ahí
      if (!this.especialidadesPersonalizadas.includes(nueva)) {
        this.especialidadesPersonalizadas.push(nueva);
      }
      
      // Marcar como touched para activar validaciones
      this.formEspecialista.get('especialidad')!.markAsTouched();
      
      console.log('✅ Especialidad agregada:', nueva);
      console.log('📋 Especialidades totales en FormControl:', especialidades);
      console.log('🎨 Especialidades personalizadas visibles:', this.especialidadesPersonalizadas);
    } else {
      console.log('⚠️ La especialidad ya existe:', nueva);
    }

    // Limpiar el input
    this.nuevaEspecialidad = '';
  }

  quitarEspecialidadPersonalizada(esp: string) {
    // 1. Quitar de las personalizadas visibles
    this.especialidadesPersonalizadas = this.especialidadesPersonalizadas.filter(e => e !== esp);

    // 2. Quitar del FormControl
    const especialidades = (this.formEspecialista.get('especialidad')!.value as string[])
      .filter(e => e !== esp);

    this.formEspecialista.get('especialidad')!.setValue(especialidades);
    
    // Marcar como touched
    this.formEspecialista.get('especialidad')!.markAsTouched();
    
    console.log('🗑️ Especialidad eliminada:', esp);
    console.log('📋 Especialidades restantes en FormControl:', especialidades);
  }

  onArchivoSeleccionado(event: Event, imagen1: boolean = false): void 
  {
    const input: HTMLInputElement = <HTMLInputElement> event.target;

    if (input.files && input.files.length == 1) 
    {
      const archivoSeleccionado = input.files[0];
      
      // Crear vista previa usando FileReader
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.tipoUsuario == "Especialista") 
        { 
          this.vistaPreviaEspecialista = e.target.result;
        } 
        else if (this.tipoUsuario == "Paciente") 
        {
          if (imagen1) 
          { 
            this.vistaPrevia1 = e.target.result;
          } 
          else 
          { 
            this.vistaPrevia2 = e.target.result;
          }
        }
      };
      reader.readAsDataURL(archivoSeleccionado);
      
      if (this.tipoUsuario == "Especialista") 
      { 
        this.archivoImagenPerfil = archivoSeleccionado; 
        this.mensajeImagenPerfil = `Imagen seleccionada: ${archivoSeleccionado.name}`; 
      } 
      else if (this.tipoUsuario == "Paciente") 
      {
        if (imagen1) 
        { 
          this.archivoImagen1 = archivoSeleccionado; 
          this.mensajeImagen1 = `Imagen seleccionada: ${archivoSeleccionado.name}`; 
        } 
        else 
        { 
          this.archivoImagen2 = archivoSeleccionado;
          this.mensajeImagen2 = `Imagen seleccionada: ${archivoSeleccionado.name}`; 
        }
      }
    }
  }

  async RegistrarUsuario(correo: string, password: string)
  {
    const estadoRegistro: authResponse = await this.authService.registrarUsuario(correo, password);
    
    if(!estadoRegistro.huboError) 
    {
      await this.swalService.LanzarAlert("Registro exitoso!", "success", estadoRegistro.mensajeExito);
      this.router.navigateByUrl("/bienvenida");
    }
    else { this.swalService.LanzarAlert("Error en el registro!", "error", estadoRegistro.mensajeError); }
  }

  async RegistroPaciente()
  {
    this.subiendoDatos = true;

    if(this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2)
    {
      const { nombre, apellido, edad, dni, obraSocial, email, clave} = this.formPaciente.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({
        email: email, 
        clave:clave, 
        nombre: nombre, 
        apellido:apellido,  
        edad:edad, 
        dni:dni, 
        rol:'Paciente', 
        obraSocial:obraSocial, 
        especialidades:[""],
        imagen1:'',
        imagen2:''
      });
                                                                             
      if(!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('pacientes',`${email}/imagen1.jpg`, this.archivoImagen1);
        await this.storageService.guardarImagen('pacientes',`${email}/imagen2.jpg`, this.archivoImagen2);
        
        // Esperar a que se guarden las imágenes
        await new Promise(resolve => setTimeout(resolve, 2000));

        const urlDescargaImg1 = await this.storageService.obtenerUrlDescarga('pacientes',`${email}/imagen1.jpg`);
        const urlDescargaImg2 = await this.storageService.obtenerUrlDescarga('pacientes',`${email}/imagen2.jpg`);
        
        const objetoPaciente = {
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          dni: dni,
          obraSocial: obraSocial,
          email: email,
          imagen1: urlDescargaImg1,
          imagen2: urlDescargaImg2,
          rol: "Paciente"
        };
    
        this.authService.guardarContenido("usuarios", objetoPaciente);
        await this.swalService.LanzarAlert("Registro del paciente exitoso!", "success", estadoRegistro.mensajeExito);
        this.router.navigateByUrl("/bienvenida");
      }
      else { 
        this.swalService.LanzarAlert("Error en el registro del paciente!", "error", estadoRegistro.mensajeError); 
      }    

      this.subiendoDatos = false;
    }
  }

  async RegistroEspecialista()
  {
    console.log('🔍 INICIO RegistroEspecialista()');
    console.log('📝 Form válido?:', this.formEspecialista.valid);
    console.log('🖼️ Imagen cargada?:', !!this.archivoImagenPerfil);
    
    if(this.formEspecialista.valid && this.archivoImagenPerfil)
    {
      this.subiendoDatos = true;
      
      const { nombre, apellido, edad, dni, email, clave, especialidad } = this.formEspecialista.value;
      
      // OBTENER TODAS LAS ESPECIALIDADES DEL FORMCONTROL
      // Este es el array completo que incluye tanto las predefinidas como las personalizadas
      const especialidadesFinales = [...(especialidad as string[])];
      
      console.log('🔍 REGISTRO ESPECIALISTA - Debug detallado:');
      console.log('📋 Especialidades del FormControl:', especialidad);
      console.log('✅ Especialidades finales (copia):', especialidadesFinales);
      console.log('🎨 Especialidades personalizadas (solo display):', this.especialidadesPersonalizadas);
      console.log('📦 Objeto completo del form:', this.formEspecialista.value);
      console.log('📊 Cantidad de especialidades:', especialidadesFinales.length);
      
      const estadoRegistro: authResponse = await this.authService.registrarUser({
        email: email, 
        clave:clave, 
        nombre: nombre, 
        apellido:apellido,  
        edad:edad, 
        dni:dni, 
        rol:'Especialista', 
        especialidades: especialidadesFinales,
        imagen1:''
      });
    
      if(!estadoRegistro.huboError) 
      {
        console.log('✅ Usuario registrado en Auth, subiendo imagen...');
        
        await this.storageService.guardarImagen('especialistas',`${email}/imagen1.jpg`, this.archivoImagenPerfil);
        
        // Esperar a que se guarde la imagen
        await new Promise(resolve => setTimeout(resolve, 2500));

        const urlDescargaImgPerfil = await this.storageService.obtenerUrlDescarga('especialistas',`${email}/imagen1.jpg`);        

        const objetoEspecialista = {
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          dni: dni,
          rol: "Especialista",
          especialidades: especialidadesFinales,          
          email: email,
          imagen1: urlDescargaImgPerfil,
          habilitado: false,
        };

        console.log('💾 OBJETO FINAL A GUARDAR EN SUPABASE:');
        console.log('📋 especialidades array:', objetoEspecialista.especialidades);
        console.log('📊 cantidad:', objetoEspecialista.especialidades.length);
        console.log('🔍 especialidades:', JSON.stringify(objetoEspecialista.especialidades));

        await this.authService.guardarContenido("usuarios", objetoEspecialista);
        
        console.log('✅ Especialista guardado exitosamente en Supabase');
        
        await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
        this.router.navigateByUrl("/bienvenida");
      }
      else { 
        console.log('❌ Error en registro Auth:', estadoRegistro.mensajeError);
        this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError); 
      }    

      this.subiendoDatos = false;
    } else {
      console.log('❌ Formulario inválido o falta imagen');
      console.log('📋 Estado del form:', this.formEspecialista.valid);
      console.log('🖼️ Imagen cargada:', !!this.archivoImagenPerfil);
      console.log('✅ Especialidades actuales:', this.formEspecialista.get('especialidad')?.value);
      console.log('📊 Cantidad de especialidades:', (this.formEspecialista.get('especialidad')?.value as string[]).length);
      
      // Mostrar errores específicos
      Object.keys(this.formEspecialista.controls).forEach(key => {
        const control = this.formEspecialista.get(key);
        if (control?.invalid) {
          console.log(`⚠️ Campo inválido: ${key}`, control.errors);
        }
      });
      
      // Validación específica de especialidades
      const especialidadesActuales = this.formEspecialista.get('especialidad')?.value as string[];
      if (!especialidadesActuales || especialidadesActuales.length === 0) {
        console.log('❌ ERROR: No hay especialidades seleccionadas');
        this.swalService.LanzarAlert("Error", "error", "Debe seleccionar al menos una especialidad");
      }
    }
  }

  ObtenerRespuestaCaptcha(captchaResponseRecibida: any): void 
  {
    this.captchaResponse = captchaResponseRecibida; 
    console.log(this.captchaResponse);
  }
}