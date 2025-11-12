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
      imagen1: [null, [Validators.required,]] 
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
      this.router.navigateByUrl("/bienvenida");
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

  async RegistroPaciente()
  {
    this.subiendoDatos = true;

    if(this.formPaciente.valid && this.archivoImagen1 && this.archivoImagen2)
    {
      const { nombre, apellido, edad, dni, obraSocial, email, clave} = this.formPaciente.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({email: email, clave:clave, nombre: nombre
        , apellido:apellido,  edad:edad, dni:dni, rol:'Paciente', obraSocial:obraSocial, especialidades:'',imagen1:'',imagen2:''});
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

 async RegistroEspecialista()
  {
    if(this.formEspecialista.valid && this.archivoImagenPerfil)
    {
      this.subiendoDatos = true;
      const { nombre, apellido, edad, dni, especialidad, email, clave} = this.formEspecialista.value;
      const estadoRegistro: authResponse = await this.authService.registrarUser({email: email, clave:clave, nombre: nombre
        , apellido:apellido,  edad:edad, dni:dni, rol:'Especialista', especialidades:especialidad});
    
      if(!estadoRegistro.huboError) 
      {
        await this.storageService.guardarImagen('especialistas',`${email}/imagen1.jpg`, this.archivoImagenPerfil);
        // ---- Promesa que se resuelve después de 2 segundos para aguardar a que se guarde el contenido en fireStorage.
        await new Promise(resolve => setTimeout(resolve, 2500));

        const imagen1 = await this.storageService.obtenerUrlDescarga('especialistas',`${email}/imagen1.jpg`);        

        const objetoEspecialista = {
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          dni: dni,
          especialidad: especialidad,
          email: email,
          imagen1: imagen1,
          rol: "Especialista",
          habilitado: false
        };

        this.authService.guardarContenido("usuarios", objetoEspecialista);
        await this.swalService.LanzarAlert("Registro del especialista exitoso!", "success", estadoRegistro.mensajeExito);
        //this.router.navigateByUrl("/bienvenida");
      }
      else { this.swalService.LanzarAlert("Error en el registro del especialista!", "error", estadoRegistro.mensajeError); }    

      this.subiendoDatos = false;
    }
  }


}
