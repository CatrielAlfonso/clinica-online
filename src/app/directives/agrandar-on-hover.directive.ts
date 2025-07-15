import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAgrandarOnHover]'
})
export class AgrandarOnHoverDirective {
  element: ElementRef = inject(ElementRef);
  renderer: Renderer2 = inject(Renderer2);

  constructor() { this.renderer.setStyle(this.element.nativeElement, 'transition', 'transform 0.2s'); }

  // Evento al pasar el mouse (hover)
  @HostListener('mouseenter') onMouseEnter() { this.renderer.setStyle(this.element.nativeElement, 'transform', 'scale(1.2)'); }

  // Evento al quitar el mouse
  @HostListener('mouseleave') onMouseLeave() { this.renderer.setStyle(this.element.nativeElement, 'transform', 'scale(1)'); }
}
