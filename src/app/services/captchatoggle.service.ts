import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptchatoggleService {

  /** true = captcha deshabilitado (modo DEV) */
  private _disabled$ = new BehaviorSubject<boolean>(false);
  disabled$ = this._disabled$.asObservable();

  get disabled(): boolean { return this._disabled$.value; }
  set disabled(val: boolean) { this._disabled$.next(val); }
}
