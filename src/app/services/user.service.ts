import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
//import { SupabaseService } from '../firebase/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  authService: AuthService = inject(AuthService);
  //firestoreService: FirestoreService = inject(FirestoreService);

  rolUsuarioLogueado: string = "";
  dniUsuarioLogueado: number = 0;

  constructor() { 
    this.ObtenerRolUsuarioLogueado(); 
    this.ObtenerDatosUsuarioLogueado()
  }

  async ObtenerRolUsuarioLogueado(): Promise<void>
	{
	  const objetoUsuarioLogueado: any = await this.authService.obtenerUsuarioPorMail(await this.authService.getMailUsuario());
  
	  this.rolUsuarioLogueado = objetoUsuarioLogueado.rol;
	}

  async ObtenerDatosUsuarioLogueado(): Promise<any>
	{
	  const objetoUsuarioLogueado: any = await this.authService.obtenerUsuarioPorMail(await this.authService.getMailUsuario());
  
	  this.dniUsuarioLogueado = objetoUsuarioLogueado.dni;
	  this.rolUsuarioLogueado = objetoUsuarioLogueado.rol;
    
    return objetoUsuarioLogueado;
	}
}
