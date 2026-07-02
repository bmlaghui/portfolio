import {
  trigger,
  transition,
  style,
  query,
  animate,
  group,
} from '@angular/animations';

export const pageTransitions = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      }),
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('0.3s ease-in', style({ 
          opacity: 0, 
          transform: 'scale(0.98)' 
        })),
      ], { optional: true }),
      
      query(':enter', [
        style({ transform: 'translateY(10px) scale(1.01)', opacity: 0 }),
        animate('0.6s 0.1s cubic-bezier(0.2, 1, 0.2, 1)', style({ 
          opacity: 1, 
          transform: 'translateY(0) scale(1)' 
        })),
      ], { optional: true }),
    ]),
  ]),
]);
