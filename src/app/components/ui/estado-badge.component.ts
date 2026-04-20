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
      border: 1px solid #ccc;
      background: #fafafa;
      color: #555;
    }
    .badge--activo    { border-color: #999; color: #333; }
    .badge--cancelado { border-color: #bbb; color: #777; }
    .badge--terminado { border-color: #ddd; color: #999; }
  `]
})
export class EstadoBadgeComponent {
  @Input({ required: true }) estado!: Estado;
}
