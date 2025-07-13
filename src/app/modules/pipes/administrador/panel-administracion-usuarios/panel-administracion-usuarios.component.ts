import { Component } from '@angular/core';
import { InformacionUsuariosComponent } from './components/informacion-usuarios/informacion-usuarios.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { AltaUsuariosComponent } from './components/alta-usuarios/alta-usuarios.component';

@Component({
  selector: 'app-panel-administracion-usuarios',
  templateUrl: './panel-administracion-usuarios.component.html',
  styleUrl: './panel-administracion-usuarios.component.scss',
  
})
export class PanelAdministracionUsuariosComponent {
  mostrarComponente: string = 'altaUsuario';

  ActualizarComponente(componente: string) {
    this.mostrarComponente = componente;
  }
}
