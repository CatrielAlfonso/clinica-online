import { provideAnimations } from '@angular/platform-browser/animations';
import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation = trigger('routeAnimations', [
    transition('LandingPage => RegistroPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('500ms ease', style({ transform: 'translateX(100%)', opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('500ms ease', style({ transform: 'translateX(0%)', opacity: 1 }))
        ], { optional: true })
      ])
    ]),
    transition('IngresoPage => RegistroPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease', style({ transform: 'translateX(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease', style({ transform: 'translateX(0%)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
    transition('LandingPage => IngresoPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('500ms ease', style({ transform: 'translateY(-100%)', opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('500ms ease', style({ transform: 'translateY(0%)', opacity: 1 }))
        ], { optional: true })
      ])
    ]),
    transition('RegistroPage => LandingPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease', style({ transform: 'translateY(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease', style({ transform: 'translateY(0%)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition('IngresoPage => LandingPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateY(-100%)', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease', style({ transform: 'translateY(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease', style({ transform: 'translateY(0%)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition('HomePage => LoggedPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%',
          })
        ]),
        query(':enter', [
          style({ transform: 'translateX(100%)' })
        ]),
        query(':leave', [
          style({ transform: 'translateX(0)' }),
          animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ transform: 'translateX(0)' }))
        ])
      ]),
      transition('LoggedPage => HomePage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%',
          })
        ]),
        query(':enter', [
          style({ transform: 'translateX(-100%)' })
        ]),
        query(':leave', [
          style({ transform: 'translateX(0)' }),
          animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ transform: 'translateX(0)' }))
        ])
      ]),
  ])
