import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appDeshabilitarOnClick]'
})
export class DeshabilitarOnClickDirective {
  element: ElementRef = inject(ElementRef);

  @HostListener('click') onClick() {
    const btns = document.querySelectorAll('button');
    const btnClickeado = this.element.nativeElement as HTMLButtonElement;

    btns.forEach(btn => { btn.removeAttribute("disabled"); });
    
    btnClickeado.disabled = true;
  }

  constructor() {}

}
