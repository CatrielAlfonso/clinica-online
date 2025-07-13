import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},

    {path: 'bienvenida', loadComponent: () => import('./components/bienvenida/bienvenida.component').then(m => m.BienvenidaComponent)},    
    {path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)},
    /**cuando implementar lazy loading */ 
    {path: 'login', loadComponent: () => import('./components/inicio-sesion/inicio-sesion.component').then(m => m.InicioSesionComponent)},
    {path: 'registro', loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent)},


];
