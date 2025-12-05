import { Component, inject, ViewEncapsulation } from '@angular/core';
import { authResponse, AuthService } from '../../../../../../services/auth.service';
import { SweetAlertService } from '../../../../../../../../src/app/services/sweet-alert.service';
import { Router } from '@angular/router';
import { SupabaseDataService } from '../../../../../../services/supabase-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseStorageService } from '../../../../../../services/supabase-storage.service';

@Component({
  selector: 'app-alta-usuarios',
  templateUrl: './alta-usuarios.component.html',
  styleUrl: './alta-usuarios.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AltaUsuariosComponent {
  authService = inject(AuthService);
  swalService = inject(SweetAlertService);
  supabaseDataService = inject(SupabaseDataService);
  storageService = inject(SupabaseStorageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  tipoUsuario: "Paciente" | "Especialista";
  subiendoDatos: boolean;
  formPaciente!: FormGroup;
  formEspecialista!: FormGroup;
  archivoImagen1?: File;
  archivoImagen2?: File;
  archivoImagenPerfil?: File;
  mensajeImagen1: string;
  mensajeImagen2: string;
  mensajeImagenPerfil: string;

  // Vista previa de imágenes
  vistaPrevia1?: string;
  vistaPrevia2?: string;
  vistaPreviaEspecialista?: string;

  // Especialidades múltiples
  especialidadesDisponibles: string[] = [
    'Dermatología',
    'Traumatología',
    'Odontología',
    'Kinesiología',
  ];
  especialidadesPersonalizadas: string[] = [];
  nuevaEspecialidad: string = '';

  // Captcha
  captchaResuelto: boolean = false;
  mostrarCaptchaPaciente: boolean = false;
  mostrarCaptchaEspecialista: boolean = false;

  constructor() 
  {
    this.tipoUsuario = "Paciente";
    this.subiendoDatos = false;
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      edad: ['', [Validators.required, Validators.max(99), Validators.pattern(/^[0-9]\d*$/)]],
      dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern(/^[0-9]\d*$/)]],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required]], 
      clave: ['', [Validators.required]], 
      imagen1: [null, [Validators.required]], 
      imagen2: [null, [Validators.required]], 
    });

    this.formEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(30)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65), Validators.pattern(/^[0-9]\d*$/)]],
      dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern(/^[0-9]\d*$/)]],
      especialidad: [[], Validators.required],
      email: ['', [Validators.required]], 
      clave: ['', [Validators.required]], 
      imagen1: [null, [Validators.required]] 
    });

    this.mensajeImagen1 = "Haga click para subir la imagen 1.";
    this.mensajeImagen2 = "Haga click para subir la imagen 2.";
    this.mensajeImagenPerfil = "Haga click para subir una imagen de perfil.";
  }

  toggleEspecialidad(nombre: string, checked: boolean) {
    const especialidades = [...(this.formEspecialista.get('especialidad')!.value as string[])];

    if (checked) {
      if (!especialidades.includes(nombre)) {
        especialidades.push(nombre);
      }
    } else {
      const index = especialidades.indexOf(nombre);
      if (index !== -1) {
        especialidades.splice(index, 1);
      }
    }
    
    this.formEspecialista.get('especialidad')!.setValue(especialidades);
    this.formEspecialista.get('especialidad')!.markAsTouched();
  }

  agregarNuevaEspecialidad() {
    const nueva = this.nuevaEspecialidad.trim();
    if (!nueva) return;

    const especialidades = [...(this.formEspecialista.get('especialidad')!.value as string[])];

    if (!especialidades.includes(nueva)) {
      especialidades.push(nueva);
      this.formEspecialista.get('especialidad')!.setValue(especialidades);
      
      if (!this.especialidadesPersonalizadas.includes(nueva)) {
        this.especialidadesPersonalizadas.push(nueva);
      }
      
      this.formEspecialista.get('especialidad')!.markAsTouched();
    }

    this.nuevaEspecialidad = '';
  }

  quitarEspecialidadPersonalizada(esp: string) {
    this.especialidadesPersonalizadas = this.especialidadesPersonalizadas.filter(e => e !== esp);

    const especialidades = (this.formEspecialista.get('especialidad')!.value as string[])
      .filter(e => e !== esp);

    this.formEspecialista.get('especialidad')!.setValue(especialidades);
    this.formEspecialista.get('especialidad')!.markAsTouched();
  }

  onArchivoSeleccionado(event: Event, imagen1: boolean = false): void 
  {
    const input: HTMLInputElement = <HTMLInputElement> event.target;

    if (input.files && input.files.length == 1) 
    {
      const archivoSeleccionado = input.files[0];
      
      // Crear vista previa
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

  onCaptchaResuelto(resuelto: boolean): void {
    this.captchaResuelto = resuelto;
  }

  verificarYMostrarCaptchaPaciente(): void {
    if (this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2) {
      this.mostrarCaptchaPaciente = true;
      this.captchaResuelto = false;
    } else {
      this.swalService.LanzarAlert("Formulario incompleto", "warning", "Complete todos los campos antes de continuar");
    }
  }

  verificarYMostrarCaptchaEspecialista(): void {
    if (this.formEspecialista.valid && this.archivoImagenPerfil) {
      const especialidades = this.formEspecialista.get('especialidad')?.value as string[];
      if (!especialidades || especialidades.length === 0) {
        this.swalService.LanzarAlert("Error", "error", "Debe seleccionar al menos una especialidad");
        return;
      }
      this.mostrarCaptchaEspecialista = true;
      this.captchaResuelto = false;
    } else {
      this.swalService.LanzarAlert("Formulario incompleto", "warning", "Complete todos los campos antes de continuar");
    }
  }

  async RegistroPaciente()
  {
    if (!this.captchaResuelto) {
      this.swalService.LanzarAlert("Captcha no resuelto", "warning", "Debe resolver el captcha antes de continuar");
      return;
    }

    this.subiendoDatos = true;

    if (this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2)
    {
      const { nombre, apellido, edad, dni, obraSocial, email, clave } = this.formPaciente.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({
        email: email, 
        clave: clave, 
        nombre: nombre, 
        apellido: apellido,  
        edad: edad, 
        dni: dni, 
        rol: 'Paciente', 
        obraSocial: obraSocial, 
        especialidades: [""],
        imagen1: '',
        imagen2: ''
      });
                                                                             
      if (!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('pacientes', `${email}/imagen1.jpg`, this.archivoImagen1);
        await this.storageService.guardarImagen('pacientes', `${email}/imagen2.jpg`, this.archivoImagen2);
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        const urlDescargaImg1 = await this.storageService.obtenerUrlDescarga('pacientes', `${email}/imagen1.jpg`);
        const urlDescargaImg2 = await this.storageService.obtenerUrlDescarga('pacientes', `${email}/imagen2.jpg`);
        
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
        
        // Limpiar formulario y captcha
        this.formPaciente.reset();
        this.archivoImagen1 = undefined;
        this.archivoImagen2 = undefined;
        this.vistaPrevia1 = undefined;
        this.vistaPrevia2 = undefined;
        this.mostrarCaptchaPaciente = false;
        this.captchaResuelto = false;
        this.mensajeImagen1 = "Haga click para subir la imagen 1.";
        this.mensajeImagen2 = "Haga click para subir la imagen 2.";
      }
      else { 
        this.swalService.LanzarAlert("Error en el registro del paciente!", "error", estadoRegistro.mensajeError); 
      }    

      this.subiendoDatos = false;
    }
  }

  async RegistroEspecialista()
  {
    if (!this.captchaResuelto) {
      this.swalService.LanzarAlert("Captcha no resuelto", "warning", "Debe resolver el captcha antes de continuar");
      return;
    }

    if (this.formEspecialista.valid && this.archivoImagenPerfil)
    {
      this.subiendoDatos = true;
      
      const { nombre, apellido, edad, dni, email, clave, especialidad } = this.formEspecialista.value;
      const especialidadesFinales = [...(especialidad as string[])];

      if (especialidadesFinales.length === 0) {
        this.swalService.LanzarAlert("Error", "error", "Debe seleccionar al menos una especialidad");
        this.subiendoDatos = false;
        return;
      }
      
      const estadoRegistro: authResponse = await this.authService.registrarUser({
        email: email, 
        clave: clave, 
        nombre: nombre, 
        apellido: apellido,  
        edad: edad, 
        dni: dni, 
        rol: 'Especialista', 
        especialidades: especialidadesFinales,
        imagen1: ''
      });
    
      if (!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('especialistas', `${email}/imagen1.jpg`, this.archivoImagenPerfil);
        await new Promise(resolve => setTimeout(resolve, 2500));

        const urlDescargaImgPerfil = await this.storageService.obtenerUrlDescarga('especialistas', `${email}/imagen1.jpg`);        

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

        await this.authService.guardarContenido("usuarios", objetoEspecialista);
        await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
        
        // Limpiar formulario y captcha
        this.formEspecialista.reset();
        this.archivoImagenPerfil = undefined;
        this.vistaPreviaEspecialista = undefined;
        this.especialidadesPersonalizadas = [];
        this.mostrarCaptchaEspecialista = false;
        this.captchaResuelto = false;
        this.mensajeImagenPerfil = "Haga click para subir una imagen de perfil.";
      }
      else { 
        this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError); 
      }    

      this.subiendoDatos = false;
    }
  }
}