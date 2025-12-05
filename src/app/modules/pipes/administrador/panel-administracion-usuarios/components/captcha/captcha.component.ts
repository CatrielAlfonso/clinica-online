import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  standalone: false,
  //imports: [CommonModule, FormsModule],
  template: `
    <div class="captcha-container">
      <p class="captcha-pregunta">
        Resuelve: {{ numeroAleatorio1 }} + {{ numeroAleatorio2 }} = ?
      </p>
      
      <input 
        type="number" 
        class="captcha-input"
        [(ngModel)]="respuestaUsuario"
        placeholder="Respuesta"
        (keyup.enter)="verificarRespuesta()"
      />
      
      <button 
        class="captcha-boton"
        (click)="verificarRespuesta()">
        Verificar
      </button>
      
      <span 
        class="captcha-mensaje"
        [class.captcha-correcto]="esCorrecta === true"
        [class.captcha-incorrecto]="esCorrecta === false">
        {{ mensaje }}
      </span>
    </div>
  `,
  styles: [`
    .captcha-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      margin: 2rem auto;
      max-width: 400px;
      text-align: center;
      animation: fadeIn 0.5s ease-in;
    }

    .captcha-pregunta {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .captcha-input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1.2rem;
      border: 2px solid #fff;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
      outline: none;
      transition: all 0.3s;
      box-sizing: border-box;
    }

    .captcha-input:focus {
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }

    .captcha-boton {
      width: 100%;
      padding: 0.75rem;
      font-size: 1.1rem;
      font-weight: bold;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .captcha-boton:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .captcha-boton:active {
      transform: translateY(0);
    }

    .captcha-mensaje {
      display: block;
      margin-top: 1rem;
      font-size: 1rem;
      font-weight: bold;
      min-height: 24px;
    }

    .captcha-mensaje.captcha-correcto {
      color: #4caf50;
      animation: bounceIn 0.5s;
    }

    .captcha-mensaje.captcha-incorrecto {
      color: #ff5252;
      animation: shake 0.5s;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounceIn {
      0% {
        transform: scale(0.5);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `]
})
export class CaptchaComponent implements OnInit {
  @Output() captchaResuelto = new EventEmitter<boolean>();

  numeroAleatorio1: number = 0;
  numeroAleatorio2: number = 0;
  resultadoCorrecto: number = 0;
  respuestaUsuario: number | null = null;
  mensaje: string = '';
  esCorrecta: boolean | null = null;

  ngOnInit(): void {
    this.generarNuevoCaptcha();
  }

  generarNuevoCaptcha(): void {
    this.numeroAleatorio1 = Math.floor(Math.random() * 10) + 1;
    this.numeroAleatorio2 = Math.floor(Math.random() * 10) + 1;
    this.resultadoCorrecto = this.numeroAleatorio1 + this.numeroAleatorio2;
    this.respuestaUsuario = null;
    this.mensaje = '';
    this.esCorrecta = null;
  }

  verificarRespuesta(): void {
    if (this.respuestaUsuario === null) {
      this.mensaje = '⚠️ Por favor ingresa una respuesta';
      this.esCorrecta = false;
      return;
    }

    if (this.respuestaUsuario === this.resultadoCorrecto) {
      this.mensaje = '✓ ¡Correcto!';
      this.esCorrecta = true;
      this.captchaResuelto.emit(true);
    } else {
      this.mensaje = '✗ Incorrecto, intenta de nuevo';
      this.esCorrecta = false;
      this.captchaResuelto.emit(false);
      
      // Generar nuevo captcha después de 1.5 segundos
      setTimeout(() => {
        this.generarNuevoCaptcha();
      }, 1500);
    }
  }
}