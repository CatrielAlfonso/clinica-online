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
    
    // LandingPage - Página de bienvenida
    { path: 'bienvenida', component: BienvenidaComponent, data: {animation: 'LandingPage'} },
    
    // IngresoPage - Inicio de sesión
    {path: 'inicio-sesion', component: InicioSesionComponent, data: { animation: 'IngresoPage'}},
    
    // RegistroPage - Registro
    {path: 'registro', component: RegistroComponent, data: { animation: 'RegistroPage'} },
    
    // HomePage - Inicio (después de loguearse)
    { path: 'inicio', component: InicioComponent, canActivate: [usuarioLogueadoGuard], data: { animation:'HomePage'}}, 
    
    // MiPerfilPage - Mi perfil
    { path: "mi-perfil", component: MiPerfilComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'MiPerfilPage' } },
    
    // LoggedPage - Para las páginas restantes (solicitar turno, mis turnos, mis pacientes)
    { path: "solicitar-turno", component: AltaTurnoComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'SolicitarTurnoPage' } },
    { path: "mis-turnos", component: MisTurnosComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'MisTurnosPage' } },
    { path: "mis-pacientes", component: MisPacientesComponent, canActivate: [usuarioLogueadoGuard], data: { animation: 'MisPacientesPage' } },
    
    // Módulos con lazy loading
    { path: "error", loadChildren: () => import('./modules/pipes/error/error.module').then(m => m.ErrorModule) },
    { path: "administrador", loadChildren: () => import('./modules/pipes/administrador/administrador.module').then(m => m.AdministradorModule) },
];