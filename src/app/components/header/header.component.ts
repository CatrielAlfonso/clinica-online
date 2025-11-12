import { CommonModule  } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router ,RouterLink} from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { UserService } from '../../services/user.service';
import { SupabaseService } from '../../services/supabase.service';
import { PipesModule } from '../../modules/pipes/pipes/pipes.module';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, PipesModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  supabaseService: SupabaseService = inject(SupabaseService);
  swalService: SweetAlertService = inject(SweetAlertService);

  nombreUsuario: string = "";
  

  constructor() 
  { 
    this.ObtenerNombreUsuario(); 
    this.userService.ObtenerDatosUsuarioLogueado();
  }

	ngOnInit(): void 
	{	}
  
  // 
  async ObtenerNombreUsuario()
  {
    const objetoUsuario: any = await this.authService.obtenerUsuarioPorMail(await this.authService.getMailUsuario());
    this.nombreUsuario = objetoUsuario.nombre;
  }
  
  async CerrarSesion(): Promise<void>
	{
    const respuesta: boolean = await this.swalService.LanzarAlert("¿Estás seguro/a de que deseas cerrar sesión?", "question", "", true, "Cerrar sesión");

    if(respuesta)
    {
      await this.authService.cerrarSesion();
      this.router.navigateByUrl("inicio-sesion");
    }
  }

}
