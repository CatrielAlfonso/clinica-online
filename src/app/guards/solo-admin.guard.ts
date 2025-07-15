import { CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const soloAdminGuard: CanActivateFn = async (route, state) => {
  
  let authService = inject(AuthService);
  let router = inject(Router);

  const objetoUsuarioLogueado: any = await authService.obtenerUsuarioPorMail(await authService.getMailUsuario());

  if(objetoUsuarioLogueado.rol == "Administrador") { return true; }
  else 
  {
    router.navigateByUrl("/error/unauthorized");
    return false;
  }
};
