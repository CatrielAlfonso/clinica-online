import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../../services/auth.service';
//import { FirestoreService } from '../../../../../services/firebase/firestore.service';


@Component({
  selector: 'app-administracion-especialistas',
  templateUrl: './administracion-especialistas.component.html',
  styleUrl: './administracion-especialistas.component.scss',
  standalone: false,
})
export class AdministracionEspecialistasComponent {
  authService = inject(AuthService);

  usuarios: any[] = [];
  especialistasHabilitados: any[] = [];
  especialistasNoHabilitados: any[] = [];
  actualizandoDatos: boolean = true;
  constructor() 
  { 
    this.ObtenerUsuarios(); 
    setTimeout(() => { this.AsignarUsuarios() }, 2000);
  }

  async ObtenerUsuarios()
  {
    this.authService.obtenerContenidoAsObservable("usuarios").subscribe((usuariosObtenidos: any[]) => { 
      this.actualizandoDatos = true;
      this.usuarios = usuariosObtenidos;
      setTimeout(() => { this.actualizandoDatos = false }, 2000); 
    })
  }

  AsignarUsuarios()
  {
    for(const usuario of this.usuarios)
    {
      if(usuario.rol == "Especialista" && usuario.habilitado) { this.especialistasHabilitados.push(usuario) }
      else if(usuario.rol == "Especialista" && !usuario.habilitado) { this.especialistasNoHabilitados.push(usuario) }
    }
  }

  async CambiarAutorizacionEspecialista(especialista: any, autorizacion: boolean)
  {
    let nuevosDatos = especialista;
    nuevosDatos.habilitado = autorizacion;
    await this.authService.modificarContenido("usuarios", especialista.id, nuevosDatos);
    this.usuarios.length = 0;
    this.especialistasHabilitados.length = 0;
    this.especialistasNoHabilitados.length = 0;
    this.ObtenerUsuarios(); 
    setTimeout(() => { this.AsignarUsuarios() }, 1000);
  }
}
