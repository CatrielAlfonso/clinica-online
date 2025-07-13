import { Component, inject, ViewEncapsulation } from '@angular/core';
import { authResponse, AuthService } from '../../../../../../services/auth.service';
import { SweetAlertService } from '../../../../../../../../src/app/services/sweet-alert.service';
import { Router } from '@angular/router';
//import { FirestoreService } from '../../../../../services/firebase/firestore.service';
import { SupabaseDataService } from '../../../../../../services/supabase-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseStorageService } from '../../../../../../services/supabase-storage.service'

@Component({
  selector: 'app-alta-usuarios',
  templateUrl: './alta-usuarios.component.html',
  styleUrl: './alta-usuarios.component.scss',
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos para modificar mat-radio-button
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
  especialidadSeleccionada: string;
  archivoImagen1?: File;
  archivoImagen2?: File;
  archivoImagenPerfil?: File;
  mensajeImagen1: string;
  mensajeImagen2: string;
  mensajeImagenPerfil: string;

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
      imagenPerfil: [null, [Validators.required,]] 
    });
    this.especialidadSeleccionada = "";
    this.mensajeImagen1 = "Haga click para subir la imagen 1."
    this.mensajeImagen2 = "Haga click para subir la imagen 2."
    this.mensajeImagenPerfil = "Haga click para subir una imagen de perfil."
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
      this.router.navigateByUrl("/landing");
    }
    else { this.swalService.LanzarAlert("Error en el registro!", "error", estadoRegistro.mensajeError); }
  }

  // async RegistroPaciente()
  // {
  //   this.subiendoDatos = true;

  //   if(this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2)
  //   {
     
  //     const { nombre, apellido, edad, dni, obraSocial, email, clave} = this.formPaciente.value;
  //     // const { data, error } = await this.supabaseDataService.storage.from('nombre-del-bucket').upload('ruta/archivo.jpg', archivo);
  //     const { publicUrl: url1 } = await this.storageService.subirArchivo('usuarios', `Pacientes/${email}/imagen1.jpg`, this.archivoImagen1);
  //     const { publicUrl: url2 } = await this.storageService.subirArchivo('usuarios', `Pacientes/${email}/imagen2.jpg`, this.archivoImagen2);
      
  //     // ---- Promesa que se resuelve después de 2 segundos para aguardar a que se guarde el contenido en fireStorage.
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     const urlDescargaImg1 = await this.storageService.ObtenerUrlDescarga(`Pacientes/${email}/imagen1.jpg`);
  //     const urlDescargaImg2 = await this.storageService.ObtenerUrlDescarga(`Pacientes/${email}/imagen2.jpg`);
      
  //     const objetoPaciente = {
  //       nombre: nombre,
  //       apellido: apellido,
  //       edad: edad,
  //       dni: dni,
  //       obraSocial: obraSocial,
  //       email: email,
  //       imagen1: urlDescargaImg1,
  //       imagen2: urlDescargaImg2,
  //       rol: "Paciente"
  //     };
  
  //     this.firestoreService.GuardarContenido("Usuarios", objetoPaciente);

  //     const estadoRegistro: authResponse = await this.authService.RegistrarUsuario(email, clave);
  //     this.subiendoDatos = false;
    
  //     if(!estadoRegistro.huboError) { await this.swalService.LanzarAlert("Registro del paciente exitoso!", "success", estadoRegistro.mensajeExito); }
  //     else { this.swalService.LanzarAlert("Error en el registro del paciente!", "error", estadoRegistro.mensajeError); }    
  //   }
  // }

  async RegistroPacientes() 
  {

    this.subiendoDatos = true;

    /* ‑‑ Validaciones básicas */
    if (!this.formPaciente.valid || !this.archivoImagen1 || !this.archivoImagen2) {
      this.swalService.LanzarAlert('Faltan datos', 'error',
        'Completá el formulario y subí las dos imágenes');
      this.subiendoDatos = false;
      return;
    }

    /* Datos del form */
    const { nombre, apellido, edad, dni, obraSocial, email, clave } =
      this.formPaciente.value;

    /* 1) Subir imágenes al bucket “usuarios” */
    const img1 = await this.storageService.subirArchivo(
      'usuarios',
      `Pacientes/${email}/imagen1.jpg`,
      this.archivoImagen1
    );

    if (img1.error) { this.mostrarError(img1.error); return; }

    const img2 = await this.storageService.subirArchivo(
      'usuarios',
      `Pacientes/${email}/imagen2.jpg`,
      this.archivoImagen2
    );

    if (img2.error) { this.mostrarError(img2.error); return; }

    /* 2) Crear objeto Paciente */
    const paciente = {
      nombre,
      apellido,
      edad,
      dni,
      obraSocial,
      email,
      imagen1: img1.publicUrl,
      imagen2: img2.publicUrl,
      rol: 'Paciente'
    };

    /* 3) Guardar en tabla “Usuarios” */
    await this.supabaseDataService.guardarContenido('Usuarios', paciente);

    /* 4) Crear usuario de Auth */
    const estado: authResponse =
      await this.authService.registrarUsuario(email, clave);

    this.subiendoDatos = false;

    if (!estado.huboError) {
      await this.swalService.LanzarAlert(
        'Registro exitoso',
        'success',
        estado.mensajeExito
      );
      this.formPaciente.reset();
      /* … navegar / limpiar … */
    } else {
      this.swalService.LanzarAlert(
        'Error en el registro',
        'error',
        estado.mensajeError
      );
    }
  }


/* Helper */
private mostrarError(msg: string) {
  this.swalService.LanzarAlert('Error al subir imagen', 'error', msg);
  this.subiendoDatos = false;
}

  // async RegistroEspecialista()
  // {
  //   this.subiendoDatos = true;

  //   if(this.formEspecialista.valid && this.archivoImagenPerfil)
  //   {
  //     const { nombre, apellido, edad, dni, especialidad, email, clave} = this.formEspecialista.value;
  //     await this.storageService.GuardarImagen(`Especialistas/${email}/imagenPerfil.jpg`, this.archivoImagenPerfil);

  //     // ---- Promesa que se resuelve después de 2 segundos para aguardar a que se guarde el contenido en fireStorage.
  //     await new Promise(resolve => setTimeout(resolve, 2500));

  //     const urlDescargaImgPerfil = await this.storageService.ObtenerUrlDescarga(`Especialistas/${email}/imagenPerfil.jpg`);
      
  //     const objetoEspecialista = {
  //       nombre: nombre,
  //       apellido: apellido,
  //       edad: edad,
  //       dni: dni,
  //       especialidad: especialidad,
  //       email: email,
  //       imagenPerfil: urlDescargaImgPerfil,
  //       rol: "Especialista",
  //       habilitado: true
  //     };

  //     this.firestoreService.GuardarContenido("Usuarios", objetoEspecialista);

  //     const estadoRegistro: authResponse = await this.authService.RegistrarUsuario(email, clave);
  //     this.subiendoDatos = false;
    
  //     if(!estadoRegistro.huboError) 
  //     { 
  //       await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
  //       this.formEspecialista.reset(); 
  //     }
  //     else { this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError); }    
  //   }
  // }

  async RegistroEspecialista() {
  this.subiendoDatos = true;

  if (!this.formEspecialista.valid || !this.archivoImagenPerfil) {
    this.swalService.LanzarAlert('Datos inválidos', 'error', 'Completá todos los campos requeridos.');
    this.subiendoDatos = false;
    return;
  }

  const { nombre, apellido, edad, dni, especialidad, email, clave } = this.formEspecialista.value;

  // 1. Subir imagen al bucket de supabase
  const { publicUrl, error } = await this.storageService.subirArchivo(
    'usuarios', // nombre del bucket en Supabase
    `Especialistas/${email}/imagenPerfil.jpg`,
    this.archivoImagenPerfil
  );

  if (error) {
    this.swalService.LanzarAlert('Error al subir imagen', 'error', error);
    this.subiendoDatos = false;
    return;
  }

  // 2. Crear objeto del especialista
  const objetoEspecialista = {
    nombre,
    apellido,
    edad,
    dni,
    especialidad,
    email,
    imagenPerfil: publicUrl,
    rol: "Especialista",
    habilitado: true
  };

  // 3. Guardar en tabla 'Usuarios'
  try {
    await this.supabaseDataService.guardarContenido('Usuarios', objetoEspecialista);
  } catch (e: any) {
    this.swalService.LanzarAlert('Error al guardar en la base de datos', 'error', e.message || e);
    this.subiendoDatos = false;
    return;
  }

  // 4. Crear cuenta de usuario (auth)
  const estadoRegistro: authResponse = await this.authService.registrarUsuario(email, clave);
  this.subiendoDatos = false;

  if (!estadoRegistro.huboError) {
    await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
    this.formEspecialista.reset();
  } else {
    this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError);
  }
}


}
