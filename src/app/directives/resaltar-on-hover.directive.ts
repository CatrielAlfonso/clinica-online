import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarOnHover]'
})
export class ResaltarOnHoverDirective {
  element: ElementRef = inject(ElementRef);
  renderer: Renderer2 = inject(Renderer2);

  constructor() {}

  @HostListener('mouseenter') onMouseEnter() { this.renderer.setStyle(this.element.nativeElement, 'backgroundColor', '#55ddffd7'); }
  
  @HostListener('mouseleave') onMouseLeave() { this.renderer.removeStyle(this.element.nativeElement, 'backgroundColor'); }
}
