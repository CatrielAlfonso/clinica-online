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


@Component({
  selector: 'app-registro',
  imports: [FormsModule,CommonModule, AngularMaterialModule, ReactiveFormsModule, RecaptchaModule, RouterLink],
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
  especialidadSeleccionada: string;
  archivoImagen1?: File;
  archivoImagen2?: File;
  archivoImagenPerfil?: File;
  mensajeImagen1: string;
  mensajeImagen2: string;
  mensajeImagenPerfil: string;
  token: string|undefined;
  //--- ReCaptchaV2 (Traido de tesys) ---//
  captchaResponse:any = null;

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
      especialidad: ['', Validators.required],
      email: ['', [Validators.required,]], 
      clave: ['', [Validators.required,]], 
      imagen1: [null, [Validators.required,]] 
    });
    this.especialidadSeleccionada = "";
    this.mensajeImagen1 = "Haga click para subir la imagen 1."
    this.mensajeImagen2 = "Haga click para subir la imagen 2."
    this.mensajeImagenPerfil = "Haga click para subir su imagen de perfil."
  }

  onArchivoSeleccionado(event: Event, imagen1: boolean = false): void 
  {
    const input: HTMLInputElement = <HTMLInputElement> event.target;

    if (input.files && input.files.length == 1) 
    {
      const archivoSeleccionado = input.files[0];
      
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

// async registrarPaciente(): Promise<void> {
//   this.subiendoDatos = true;

//   if (this.formPaciente.invalid || !this.archivoImagen1 || !this.archivoImagen2) {
//     this.swalService.LanzarAlert('Error', 'Formulario incompleto', 'error');
//     this.subiendoDatos = false;
//     return;
//   }

//   // 1· Registramos en Supabase Auth
//   const { email, clave } = this.formPaciente.value;
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password: clave,
//   });

//   if (error || !data.user) {
//     this.swalService.LanzarAlert('Error', error?.message ?? 'Falló el registro', 'error');
//     this.subiendoDatos = false;
//     return;
//   }

//   /* ─────────── DEFENDEMOS EL ID ─────────── */
//   const authId = data.user.id;           // ← UUID generado por Auth

//   /* ─────────── 2· Subimos las imágenes ─────────── */
//   // bucket “clinica-files” público (o genera URL firmada si es privado)
//   const carpeta = `pacientes/${authId}`;  // usamos el uuid para no repetir mails
//   await this.storageService.guardarImagen('clinica-files', `${carpeta}/img1.jpg`, this.archivoImagen1);
//   await this.storageService.guardarImagen('clinica-files', `${carpeta}/img2.jpg`, this.archivoImagen2);

//   const urlImg1 = this.storageService.obtenerUrlDescarga('pacientes', `${carpeta}/img1.jpg`);
//   const urlImg2 = this.storageService.obtenerUrlDescarga('pacientes', `${carpeta}/img2.jpg`);

//   /* ─────────── 3· Insertamos en nuestra tabla ─────────── */
//   const { nombre, apellido, edad, dni, obraSocial } = this.formPaciente.value;

//   const pacienteRow = {
//     auth_id:       authId,       // La columna uuid que creaste
//     nombre,
//     apellido,
//     edad:           Number(edad),
//     dni:            Number(dni),
//     rol:            'Paciente',
//     obra_social:    obraSocial,
//     email,
//     imagen1:        urlImg1,
//     imagen2:        urlImg2,
//   };

//   const { error: insertError } = await supabase.from('users').insert(pacienteRow);

//   if (insertError) {
//     // Si falla la inserción, quizá quieras borrar el usuario auth y las imágenes
//     this.swalService.LanzarAlert('Error', insertError.message, 'error');
//     this.subiendoDatos = false;
//     return;
//   }

//   /* ─────────── 4· Feedback al usuario ─────────── */
//   await this.swalService.LanzarAlert(
//     'Registro exitoso, ¡Revisá tu correo para confirmar tu cuenta!',
//     'success'
//   );
//   this.router.navigate(['/inicio']);
//   this.subiendoDatos = false;
// }

  async RegistroPaciente()
  {
    this.subiendoDatos = true;

    if(this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2)
    {
      const { nombre, apellido, edad, dni, obraSocial, email, clave} = this.formPaciente.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({email: email, clave:clave, nombre: nombre
        , apellido:apellido,  edad:edad, dni:dni, rol:'Paciente', obraSocial:obraSocial, especialidad:'',imagen1:'',imagen2:''});
        //const resp = await this.authService.registrarUser({ email:email, clave: clave, nombre:nombre });                                                                         
      if(!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('pacientes',`${email}/imagen1.jpg`, this.archivoImagen1);
        await this.storageService.guardarImagen('pacientes',`${email}/imagen2.jpg`, this.archivoImagen2);
        
        // ---- Promesa que se resuelve después de 2 segundos para aguardar a que se guarde el contenido en fireStorage.
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
      else { this.swalService.LanzarAlert("Error en el registro del paciente!", "error", estadoRegistro.mensajeError); }    

      this.subiendoDatos = false;
    }
  }

  async RegistroEspecialista()
  {
    if(this.formEspecialista.valid && this.archivoImagenPerfil)
    {
      this.subiendoDatos = true;
      const { nombre, apellido, edad, dni, especialidad, email, clave} = this.formEspecialista.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({email: email, clave:clave, nombre: nombre
        , apellido:apellido,  edad:edad, dni:dni, rol:'Especialista', especialidad:especialidad,imagen1:''});
    
      if(!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('especialistas',`${email}/imagen1.jpg`, this.archivoImagenPerfil);
        // ---- Promesa que se resuelve después de 2 segundos para aguardar a que se guarde el contenido en fireStorage.
        await new Promise(resolve => setTimeout(resolve, 2500));

        const urlDescargaImgPerfil = await this.storageService.obtenerUrlDescarga('especialistas',`${email}/imagen1.jpg`);        

        const objetoEspecialista = {
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          dni: dni,
          especialidad: especialidad,
          email: email,
          imagen1: urlDescargaImgPerfil,
          rol: "Especialista",
          habilitado: false
        };

        this.authService.guardarContenido("usuarios", objetoEspecialista);
        await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
        this.router.navigateByUrl("/bienvenida");
      }
      else { this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError); }    

      this.subiendoDatos = false;
    }
  }

  ObtenerRespuestaCaptcha(captchaResponseRecibida: any): void 
  {
    this.captchaResponse = captchaResponseRecibida; console.log(this.captchaResponse)
  }

}
