import {
  Directive, EventEmitter, HostBinding, HostListener,
  Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { inject } from '@angular/core';
import { CaptchatoggleService } from '../services/captchatoggle.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCaptcha]', // css de ejemplo
})
export class CaptchaDirective implements OnInit, OnDestroy {
  /** El padre puede forzar deshabilitar el captcha solo para este uso */
  @Input() disabled = false;

  /** true = desafío superado */
  @Output() solved = new EventEmitter<boolean>();

  @HostBinding('class.captcha--disabled') get cssDisabled() {
    return this.disabled || this.globalDisabled;
  }

  private globalDisabled = false;
  private sub?: Subscription;
  toggleService = inject(CaptchatoggleService);

  // mini‑estado interno
  private _checked = false;

  constructor() {}

  ngOnInit(): void {
    // escucha flag global
    this.sub = this.toggleService.disabled$.subscribe(
      d => { this.globalDisabled = d; if (d) this.solved.emit(true); }
    );
  }

  /* ------ UX muy simple: clic en el recuadro = resuelto ------ */
  @HostListener('click')
  onClick(): void {
    if (this.disabled || this.globalDisabled) return;

    this._checked = !this._checked;          // toggle
    this.solved.emit(this._checked);         // envía al padre
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}