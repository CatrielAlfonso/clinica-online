import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, authResponse } from '../../services/auth.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AngularMaterialModule } from '../../modules/pipes/angular-material/angular-material.module';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';
import { RouterLink } from '@angular/router';

interface IUsuario {
  correo: string;
  clave: string;
  imagen: string;
  nombre: string;
}


@Component({
  selector: 'app-inicio-sesion',
  imports: [FormsModule, CommonModule, AngularMaterialModule, PipesModule, RouterLink],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class InicioSesionComponent {

  authService: AuthService = inject(AuthService);
  swalService: SweetAlertService = inject(SweetAlertService);

  name!:string;
  age!:number;
  nameRegistro!:string;
  mensajeError!:string;
  emailRegistro!:string;
  passwordRegistro!:string;
  passwordRepetida: string = '';
  passwordsNoCoinciden: boolean = false;


  avatarUrl!:string;
  avatarFile!:File;
  emailInvalido: boolean = false;
  nombreInvalido: boolean = false;
  passwordInvalida: boolean = false;
  userLogueado:boolean = false;

  //PROBANDO

  correoIngresado: string;
  claveIngresada: string;
  accesoRapidoSeleccionado: string;

  Paciente1: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };
  Paciente2: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };
  Paciente3: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };
  Especialista1: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };
  Especialista2: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };
  Admin1: IUsuario = { correo: "", clave: "", imagen: "", nombre: "" };

  constructor(private router:Router, private sweetAlertService: SweetAlertService) 
  {
    this.correoIngresado = "";
    this.claveIngresada = "";
    this.accesoRapidoSeleccionado = "";

    this.AsignarImagenes();
  }

   async AsignarImagenes(): Promise<void>
  {
    this.authService.obtenerContenidoAsObservable("usuarios").subscribe(usuarios => {
      for(const usuario of usuarios)
      {
        if(usuario.email == "catrielalfonso77@gmail.com") { this.Admin1 = { correo: usuario.email, clave: "123456", imagen: usuario.imagen1, nombre: usuario.nombre }; }
        else if(usuario.email == "bondilentes.bl@gmail.com") { this.Especialista1 = { correo: usuario.email, clave: "123456", imagen: usuario.imagen1, nombre: usuario.nombre }; }
        else if(usuario.email == "fomopo4864@lhory.com") { this.Especialista2 = { correo: usuario.email, clave: "123456", imagen: usuario.imagen1, nombre: usuario.nombre }; }
        else if(usuario.email == "llnxs5cqif@qacmjeq.com") { this.Paciente1 = { correo: usuario.email, clave: "123456", imagen: usuario.imagen1, nombre: usuario.nombre }; }
        else if(usuario.email == "courageous.stingray.cwdl@letterprotect.net") { this.Paciente2 = { correo: usuario.email, clave: "graciasTotales", imagen: usuario.imagen1, nombre: usuario.nombre }; }
        else if(usuario.email == "enzofernandes@bltiwd.com") { this.Paciente3 = { correo: usuario.email, clave: "chelsea", imagen: usuario.imagen1, nombre: usuario.nombre }; }
      }
    })
  }

  LlenarCamposIngreso(correo: string, clave: string): void
  {
    this.correoIngresado = correo;
    this.claveIngresada = clave;
  }




  AutoComplete():void
  {
      this.emailRegistro="tapov47538@bauscn.com";
      this.passwordRegistro="123456";
  }

  // isFormValid(): boolean {
    
  // }

  async IniciarSesion(): Promise<void>
  {
    const estadoInicioSesion: authResponse = await this.authService.IniciarSesion(this.correoIngresado, this.claveIngresada);
  
    if(!estadoInicioSesion.huboError) 
    {
      const objetoUsuarioObtenido = await this.authService.obtenerUsuarioPorMail(this.correoIngresado);
      
      const fechaActual = new Date();
      const fecha = fechaActual.toLocaleDateString();
      const horario = fechaActual.toLocaleTimeString();

      const objetoDatosIngreso = {
        usuario: this.correoIngresado,
        fecha: fecha,
        horario: horario
      }

      this.authService.GuardarContenido("ingresos", objetoDatosIngreso);

      if(objetoUsuarioObtenido.rol == "Especialista" || objetoUsuarioObtenido.rol == "Administrador")
      {
        if(objetoUsuarioObtenido.habilitado)
        {
          //await this.swalService.LanzarAlert("Inicio de sesión exitoso!", "success", estadoInicioSesion.mensajeExito);
          await this.swalService.temporallyShowLoadingAlert("Inicio de sesión exitoso!", "Redirigiendo...", 1000);
          this.router.navigateByUrl("/inicio");
        }
        else
        {
          await this.swalService.LanzarAlert("Error en el inicio de sesión!", "error", "Su usuario aún no ha sido aprobado por un administrador...");
          await this.authService.cerrarSesion();
          console.log("Sesion cerrada");
        }
      }
      else 
      {
        await this.swalService.LanzarAlert("Inicio de sesión exitoso!", "success", estadoInicioSesion.mensajeExito);
        this.router.navigateByUrl("/inicio");
      } 
    }
    else { this.swalService.LanzarAlert("Error en el inicio de sesión", "error", estadoInicioSesion.mensajeError); }
  }


  Logearse() 
  {
    this.authService.iniciarSesion(this.emailRegistro, this.passwordRegistro)
      .then(({ user, error }) => {
        if (error) {
          // Mostrar error con SweetAlert o similar
          console.error('Error al iniciar sesión:', error);
          this.sweetAlertService.showAlert('Error', error, 'error');
          this.userLogueado = false;

          
        } else if (user) {
          console.log('Sesión iniciada correctamente');
          this.sweetAlertService.showAlert('Éxito', 'Has iniciado sesión correctamente', 'success');
          this.userLogueado = true;
          this.router.navigate(['/home']);
          // Redireccionar o manejar sesión
        }
      });
  }

  Registrarse() 
  {

    this.verificarNombre();
    this.verificarEmail();
    this.verificarPassword();
    this.verificarPasswordRepetida();

    if (this.nombreInvalido || this.emailInvalido || this.passwordInvalida || this.passwordsNoCoinciden) {
      return; // No continuar si hay errores
    }
    console.log('Datos de registro:', this.emailRegistro, this.passwordRegistro, this.nameRegistro);
    this.authService.registrarUsuario(this.emailRegistro, this.passwordRegistro, this.nameRegistro);
  }

  verificarPasswordRepetida() {
  this.passwordsNoCoinciden = this.passwordRegistro !== this.passwordRepetida;
  }

  verificarFormRegistro() {
    this.verificarEmail();
    this.verificarNombre();
    this.verificarPassword();

    if (this.emailInvalido || this.nombreInvalido || this.passwordInvalida) {
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      return false;
    } else {
      this.mensajeError = '';
      return true;
    }
  }


  verificarEmail() {
    const emailInput = (<HTMLInputElement>document.getElementById('registerEmail')).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(emailInput);
    this.emailRegistro = emailInput; // actualizás la variable
  }
  
  verificarNombre() {
    const nombreInput = (<HTMLInputElement>document.getElementById('registerName')).value;
    this.nombreInvalido = nombreInput.length < 6;
    this.nameRegistro = nombreInput;
  }
  
  verificarPassword() {
    const passwordInput = (<HTMLInputElement>document.getElementById('registerPassword')).value;
    this.passwordInvalida = passwordInput.length < 6;
    this.passwordRegistro = passwordInput;
  }
  

  ShowHidePassword():void
  {
          
      let eyeIcon:any = document.getElementById('eyeIcon');
      let password:any = document.getElementById('password-login');


      
      if(password.type == "password")
      {
          password.type = "text";
          eyeIcon.className = "bx bxs-hide";
      }
      else
      {
          eyeIcon.className = "bx bxs-show";
          password.type = "password"
      }   
  }

  
//avatarUrl = '';

ngOnInit() {
  this.authService.obtenerSesionActual().then(({ user }) => {
    if (user) {
      this.userLogueado = true;
      // this.avatarUrl = user.user_metadata?.avatar_url || '../../assets/img/userDefault.png';
    }
  });
}

LogOut() {
  this.authService.cerrarSesion();
}

  LogInRegisterButton():void
  {
      const container:any = document.querySelector('.container');

      container.classList.add('active');
  }

  RegisterLogInButton():void
  {
      const container:any = document.querySelector('.container');

      container.classList.remove('active');
  }



}
