import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective implements OnInit {
  @Input() captchaHabilitado: boolean = true;
  @Output() captchaResuelto = new EventEmitter<boolean>();

  private captchaContainer: HTMLDivElement | null = null;
  private numeroAleatorio1: number = 0;
  private numeroAleatorio2: number = 0;
  private resultadoCorrecto: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.captchaHabilitado) {
      this.crearCaptcha();
    }
  }

  private crearCaptcha(): void {
    // Generar números aleatorios
    this.numeroAleatorio1 = Math.floor(Math.random() * 10) + 1;
    this.numeroAleatorio2 = Math.floor(Math.random() * 10) + 1;
    this.resultadoCorrecto = this.numeroAleatorio1 + this.numeroAleatorio2;

    // Crear contenedor del captcha
    this.captchaContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.captchaContainer, 'captcha-container');

    // Crear pregunta
    const pregunta = this.renderer.createElement('p');
    this.renderer.addClass(pregunta, 'captcha-pregunta');
    const textoPregunta = this.renderer.createText(
      `Resuelve: ${this.numeroAleatorio1} + ${this.numeroAleatorio2} = ?`
    );
    this.renderer.appendChild(pregunta, textoPregunta);

    // Crear input
    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'type', 'number');
    this.renderer.setAttribute(input, 'placeholder', 'Respuesta');
    this.renderer.addClass(input, 'captcha-input');

    // Crear botón verificar
    const boton = this.renderer.createElement('button');
    this.renderer.addClass(boton, 'captcha-boton');
    const textoBoton = this.renderer.createText('Verificar');
    this.renderer.appendChild(boton, textoBoton);

    // Mensaje de resultado
    const mensaje = this.renderer.createElement('span');
    this.renderer.addClass(mensaje, 'captcha-mensaje');

    // Evento del botón
    this.renderer.listen(boton, 'click', () => {
      const valorIngresado = parseInt(input.value);
      
      if (valorIngresado === this.resultadoCorrecto) {
        this.renderer.setProperty(mensaje, 'textContent', '✓ Correcto');
        this.renderer.addClass(mensaje, 'captcha-correcto');
        this.renderer.removeClass(mensaje, 'captcha-incorrecto');
        this.captchaResuelto.emit(true);
        
        // Ocultar captcha después de 1 segundo
        setTimeout(() => {
          if (this.captchaContainer) {
            this.renderer.setStyle(this.captchaContainer, 'display', 'none');
          }
        }, 1000);
      } else {
        this.renderer.setProperty(mensaje, 'textContent', '✗ Incorrecto, intenta de nuevo');
        this.renderer.addClass(mensaje, 'captcha-incorrecto');
        this.renderer.removeClass(mensaje, 'captcha-correcto');
        this.captchaResuelto.emit(false);
        
        // Generar nuevo captcha
        setTimeout(() => {
          this.regenerarCaptcha(pregunta, input, mensaje);
        }, 1500);
      }
    });

    // Agregar elementos al contenedor
    this.renderer.appendChild(this.captchaContainer, pregunta);
    this.renderer.appendChild(this.captchaContainer, input);
    this.renderer.appendChild(this.captchaContainer, boton);
    this.renderer.appendChild(this.captchaContainer, mensaje);

    // Insertar el captcha antes del elemento host
    this.renderer.insertBefore(
      this.el.nativeElement.parentNode,
      this.captchaContainer,
      this.el.nativeElement
    );
  }

  private regenerarCaptcha(pregunta: any, input: any, mensaje: any): void {
    this.numeroAleatorio1 = Math.floor(Math.random() * 10) + 1;
    this.numeroAleatorio2 = Math.floor(Math.random() * 10) + 1;
    this.resultadoCorrecto = this.numeroAleatorio1 + this.numeroAleatorio2;

    this.renderer.setProperty(
      pregunta,
      'textContent',
      `Resuelve: ${this.numeroAleatorio1} + ${this.numeroAleatorio2} = ?`
    );
    this.renderer.setProperty(input, 'value', '');
    this.renderer.setProperty(mensaje, 'textContent', '');
    this.renderer.removeClass(mensaje, 'captcha-correcto');
    this.renderer.removeClass(mensaje, 'captcha-incorrecto');
  }
}