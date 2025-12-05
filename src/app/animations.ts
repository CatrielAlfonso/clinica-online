import { provideAnimations } from '@angular/platform-browser/animations';
import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation = trigger('routeAnimations', [
    // ============================================
    // ANIMACIONES ORIGINALES (Landing, Ingreso, Registro)
    // ============================================
    
    // 1. SLIDE HORIZONTAL - LandingPage => RegistroPage
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

    // 2. FADE WITH SCALE - IngresoPage => RegistroPage
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
          style({ opacity: 0, transform: 'scale(0.8)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease-out', style({ opacity: 0, transform: 'scale(1.2)' }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms 200ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
          ], { optional: true })
        ])
      ]),

    // 3. SLIDE VERTICAL - LandingPage => IngresoPage
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

    // 4. ROTATE AND FADE - RegistroPage => LandingPage
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
          style({ opacity: 0, transform: 'rotate(-5deg) scale(0.9)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('600ms ease-in-out', style({ 
              opacity: 0, 
              transform: 'rotate(5deg) scale(1.1)' 
            }))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease-in-out', style({ 
              opacity: 1, 
              transform: 'rotate(0deg) scale(1)' 
            }))
          ], { optional: true })
        ])
      ]),

      // 5. FLIP EFFECT - IngresoPage => LandingPage
      transition('IngresoPage => LandingPage', [
        style({ position: 'relative', perspective: '1000px' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backfaceVisibility: 'hidden'
          })
        ], { optional: true }),
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'rotateY(-180deg)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('700ms ease-in-out', style({ 
              opacity: 0,
              transform: 'rotateY(180deg)' 
            }))
          ], { optional: true }),
          query(':enter', [
            animate('700ms ease-in-out', style({ 
              opacity: 1,
              transform: 'rotateY(0deg)' 
            }))
          ], { optional: true })
        ])
      ]),

      // 6. ZOOM AND SLIDE - HomePage => MiPerfilPage
      transition('HomePage => MiPerfilPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%',
          })
        ], { optional: true }),
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translate(50%, 50%) scale(0.5)' 
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-in', style({ 
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.5)' 
            }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms 100ms ease-out', style({ 
              opacity: 1,
              transform: 'translate(0, 0) scale(1)' 
            }))
          ], { optional: true })
        ])
      ]),

      // 7. BOUNCE EFFECT - MiPerfilPage => HomePage
      transition('MiPerfilPage => HomePage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%',
          })
        ], { optional: true }),
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translateX(-100%) scale(0.7)' 
          })
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0) scale(1)' }),
          animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
            style({ 
              opacity: 0,
              transform: 'translateX(100%) scale(0.7)' 
            }))
        ], { optional: true }),
        query(':enter', [
          animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
            style({ 
              opacity: 1,
              transform: 'translateX(0) scale(1)' 
            }))
        ], { optional: true })
      ]),

      // 8. SLIDE FROM BOTTOM - RegistroPage => IngresoPage
      transition('RegistroPage => IngresoPage', [
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
          style({ 
            opacity: 0,
            transform: 'translateY(100%)' 
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('450ms ease-in', style({ 
              opacity: 0,
              transform: 'translateY(-20%)' 
            }))
          ], { optional: true }),
          query(':enter', [
            animate('450ms ease-out', style({ 
              opacity: 1,
              transform: 'translateY(0%)' 
            }))
          ], { optional: true })
        ])
      ]),

      // ============================================
      // NUEVAS ANIMACIONES PARA PÁGINAS ADICIONALES
      // ============================================

      // 9. WAVE EFFECT - IngresoPage => HomePage (después de login)
      transition('IngresoPage => HomePage', [
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
          style({ 
            opacity: 0,
            transform: 'translateX(-100%) rotate(-10deg)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('550ms ease-in-out', style({ 
              opacity: 0,
              transform: 'translateX(100%) rotate(10deg)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('550ms ease-in-out', style({ 
              opacity: 1,
              transform: 'translateX(0%) rotate(0deg)'
            }))
          ], { optional: true })
        ])
      ]),

      // 10. SLIDE RIGHT - RegistroPage => HomePage (después de registro)
      transition('RegistroPage => HomePage', [
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
          style({ 
            opacity: 0,
            transform: 'translateX(100%)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease', style({ 
              opacity: 0,
              transform: 'translateX(-100%)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease', style({ 
              opacity: 1,
              transform: 'translateX(0%)'
            }))
          ], { optional: true })
        ])
      ]),

      // 11. SCALE UP - HomePage => SolicitarTurnoPage
      transition('HomePage => SolicitarTurnoPage', [
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
          style({ 
            opacity: 0,
            transform: 'scale(0.5)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease-out', style({ 
              opacity: 0,
              transform: 'scale(1.5)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms 100ms ease-in', style({ 
              opacity: 1,
              transform: 'scale(1)'
            }))
          ], { optional: true })
        ])
      ]),

      // 12. SLIDE DOWN - SolicitarTurnoPage => HomePage
      transition('SolicitarTurnoPage => HomePage', [
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
          style({ 
            opacity: 0,
            transform: 'translateY(-100%)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease', style({ 
              opacity: 0,
              transform: 'translateY(100%)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease', style({ 
              opacity: 1,
              transform: 'translateY(0%)'
            }))
          ], { optional: true })
        ])
      ]),

      // 13. ROTATE IN - HomePage => MisTurnosPage
      transition('HomePage => MisTurnosPage', [
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
          style({ 
            opacity: 0,
            transform: 'rotate(90deg) scale(0.5)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('550ms ease-in-out', style({ 
              opacity: 0,
              transform: 'rotate(-90deg) scale(0.5)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('550ms ease-in-out', style({ 
              opacity: 1,
              transform: 'rotate(0deg) scale(1)'
            }))
          ], { optional: true })
        ])
      ]),

      // 14. FADE DIAGONAL - MisTurnosPage => HomePage
      transition('MisTurnosPage => HomePage', [
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
          style({ 
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.8)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('450ms ease-out', style({ 
              opacity: 0,
              transform: 'translate(50%, 50%) scale(0.8)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('450ms ease-in', style({ 
              opacity: 1,
              transform: 'translate(0, 0) scale(1)'
            }))
          ], { optional: true })
        ])
      ]),

      // 15. CURTAIN VERTICAL - HomePage => MisPacientesPage
      transition('HomePage => MisPacientesPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ 
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('600ms ease-in-out', style({ 
              opacity: 0,
              clipPath: 'inset(100% 0 0 0)'
            }))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease-in-out', style({ 
              opacity: 1,
              clipPath: 'inset(0 0 0 0)'
            }))
          ], { optional: true })
        ])
      ]),

      // 16. ELASTIC RETURN - MisPacientesPage => HomePage
      transition('MisPacientesPage => HomePage', [
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
          style({ 
            transform: 'translateX(100%)'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
              style({ 
                transform: 'translateX(-100%)',
                opacity: 0.5
              }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
              style({ 
                transform: 'translateX(0%)'
              }))
          ], { optional: true })
        ])
      ]),

      // TRANSICIONES ENTRE PÁGINAS LOGUEADAS (navegación lateral)
      
      // SolicitarTurno <=> MisTurnos
      transition('SolicitarTurnoPage => MisTurnosPage', [
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
          style({ opacity: 0, transform: 'translateX(100%)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease', style({ opacity: 0, transform: 'translateX(-100%)' }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms ease', style({ opacity: 1, transform: 'translateX(0%)' }))
          ], { optional: true })
        ])
      ]),

      transition('MisTurnosPage => SolicitarTurnoPage', [
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
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease', style({ opacity: 0, transform: 'translateX(100%)' }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms ease', style({ opacity: 1, transform: 'translateX(0%)' }))
          ], { optional: true })
        ])
      ]),

      // MisTurnos <=> MisPacientes
      transition('MisTurnosPage => MisPacientesPage', [
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
          style({ opacity: 0, transform: 'scale(0.9) translateY(50px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('350ms ease', style({ opacity: 0, transform: 'scale(1.1) translateY(-50px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('350ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ], { optional: true })
        ])
      ]),

      transition('MisPacientesPage => MisTurnosPage', [
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
          style({ opacity: 0, transform: 'scale(1.1) translateY(-50px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('350ms ease', style({ opacity: 0, transform: 'scale(0.9) translateY(50px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('350ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ], { optional: true })
        ])
      ]),

      // MiPerfil <=> Otras páginas logueadas
      transition('MiPerfilPage => SolicitarTurnoPage, MiPerfilPage => MisTurnosPage, MiPerfilPage => MisPacientesPage', [
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
          style({ opacity: 0, transform: 'rotate(5deg) scale(0.9)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('450ms ease-in-out', style({ opacity: 0, transform: 'rotate(-5deg) scale(1.1)' }))
          ], { optional: true }),
          query(':enter', [
            animate('450ms ease-in-out', style({ opacity: 1, transform: 'rotate(0deg) scale(1)' }))
          ], { optional: true })
        ])
      ]),

      transition('SolicitarTurnoPage => MiPerfilPage, MisTurnosPage => MiPerfilPage, MisPacientesPage => MiPerfilPage', [
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
          style({ opacity: 0, transform: 'rotate(-5deg) scale(1.1)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('450ms ease-in-out', style({ opacity: 0, transform: 'rotate(5deg) scale(0.9)' }))
          ], { optional: true }),
          query(':enter', [
            animate('450ms ease-in-out', style({ opacity: 1, transform: 'rotate(0deg) scale(1)' }))
          ], { optional: true })
        ])
      ])
  ])