import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appConfettiClick]'
})
export class ConfettiClickDirective {

   @Input() confettiCount: number = 30; // Cantidad de partículas
  @Input() confettiColors: string[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.createConfetti(event.clientX, event.clientY);
  }

  private createConfetti(x: number, y: number) {
    for (let i = 0; i < this.confettiCount; i++) {
      const particle = this.renderer.createElement('div');
      
      // Estilos de la partícula
      const color = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
      const size = Math.random() * 8 + 4;
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = Math.random() * 100 + 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - (Math.random() * 100);
      
      this.renderer.setStyle(particle, 'position', 'fixed');
      this.renderer.setStyle(particle, 'left', `${x}px`);
      this.renderer.setStyle(particle, 'top', `${y}px`);
      this.renderer.setStyle(particle, 'width', `${size}px`);
      this.renderer.setStyle(particle, 'height', `${size}px`);
      this.renderer.setStyle(particle, 'background-color', color);
      this.renderer.setStyle(particle, 'border-radius', '50%');
      this.renderer.setStyle(particle, 'pointer-events', 'none');
      this.renderer.setStyle(particle, 'z-index', '9999');
      this.renderer.setStyle(particle, 'transition', 'all 1s cubic-bezier(0, .9, .57, 1)');
      this.renderer.setStyle(particle, 'opacity', '1');
      
      this.renderer.appendChild(document.body, particle);
      
      // Animar partícula
      setTimeout(() => {
        this.renderer.setStyle(particle, 'transform', `translate(${tx}px, ${ty + 200}px) rotate(${Math.random() * 360}deg)`);
        this.renderer.setStyle(particle, 'opacity', '0');
      }, 10);
      
      // Remover después de la animación
      setTimeout(() => {
        this.renderer.removeChild(document.body, particle);
      }, 1000);
    }
  }
}
