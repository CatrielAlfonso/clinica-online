import { CommonModule,  } from '@angular/common';
import { Component, NgModule, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {

    rolSeleccionado: 'paciente' | 'especialista' | 'admin' | null = null;

  constructor(private router: Router) {}


  

  iniciarSesion() {
    if (this.rolSeleccionado) {
      this.router.navigate(['inicio-sesion'], {
        queryParams: { rol: this.rolSeleccionado }
      });
    } else {
      alert('Por favor, seleccioná tu rol antes de iniciar sesión.');
    }
  }

  registrarse() {
    if (this.rolSeleccionado) {
      this.router.navigate(['/registro'], {
        queryParams: { rol: this.rolSeleccionado }
      });
    } else {
      alert('Por favor, seleccioná tu rol antes de registrarte.');
    }
  }
   

}
