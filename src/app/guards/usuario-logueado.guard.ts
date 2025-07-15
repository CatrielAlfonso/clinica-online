import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const usuarioLogueadoGuard: CanActivateFn = async (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);

  if (await authService.getMailUsuario() != "") { return true; }

  else 
  {
    router.navigateByUrl("/error/unauthorized");
    return false;
  }
};
