import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  imports:[CommonModule,RouterLink]
})
export class InicioComponent {
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  //firestoreService: FirestoreService = inject(FirestoreService);
  router: Router = inject(Router);

  nombreUsuario: string = "";

  constructor() 
  { 
    this.ObtenerNombreUsuario();
    this.userService.ObtenerDatosUsuarioLogueado();
  }

  async ObtenerNombreUsuario()
  {
    const objetoUsuario: any = await this.authService.obtenerUsuarioPorMail(await this.authService.getMailUsuario());
    console.log("Usuario obtenido" + JSON.stringify(objetoUsuario));
    this.nombreUsuario = objetoUsuario.nombre;
  }
}
