import { Component, Input } from '@angular/core';
import { Estado } from '../../models/evento.model';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge--' + estado.toLowerCase()">{{ estado }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .badge--activo    { background: #c6f6d5; color: #22543d; }
    .badge--cancelado { background: #fed7d7; color: #9b2c2c; }
    .badge--terminado { background: #e2e8f0; color: #4a5568; }
  `]
})
export class EstadoBadgeComponent {
  @Input({ required: true }) estado!: Estado;
}
