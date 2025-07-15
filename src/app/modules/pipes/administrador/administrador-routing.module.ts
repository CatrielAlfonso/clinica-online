import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { soloAdminGuard } from '../../../guards/solo-admin.guard';
import { PanelAdministracionUsuariosComponent } from './panel-administracion-usuarios/panel-administracion-usuarios.component';
import { usuarioLogueadoGuard } from '../../../guards/usuario-logueado.guard';
import { TurnosComponent } from './turnos/turnos.component';

const routes: Routes = [
  { path: "panel-administracion-usuarios", component: PanelAdministracionUsuariosComponent, canActivate: [usuarioLogueadoGuard, soloAdminGuard] },
  { path: "turnos", component: TurnosComponent, canActivate: [usuarioLogueadoGuard, soloAdminGuard] } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
