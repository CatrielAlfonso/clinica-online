import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { usuarioLogueadoGuard } from './guards/usuario-logueado.guard';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { animation } from '@angular/animations';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { MisPacientesComponent } from './components/mis-pacientes/mis-pacientes.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';

export const routes: Routes = [

    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    { path: 'bienvenida', component: BienvenidaComponent, data: {animation: 'LandingPage'} },
    /**cuando implementar lazy loading */ 
    {path: 'inicio-sesion', component: InicioSesionComponent, data: { animation: 'IngresoPage'}},
    {path: 'registro', component: RegistroComponent, data: { animation: 'RegistroPage'} },
    { path: 'inicio',component: InicioComponent,canActivate: [usuarioLogueadoGuard] }, 
    { path: "mi-perfil", component: MiPerfilComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'LoggedPage' } },
    { path: "solicitar-turno", component: AltaTurnoComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'LoggedPage' } },
    { path: "mis-turnos", component: MisTurnosComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'LoggedPage' } },
    { path: "mis-pacientes", component: MisPacientesComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'LoggedPage' } },
    { path: "error", loadChildren: () => import('./modules/pipes/error/error.module').then(m => m.ErrorModule) },
    { path: "administrador", loadChildren: () => import('./modules/pipes/administrador/administrador.module').then(m => m.AdministradorModule) },

];
