import { Component, Input } from '@angular/core';
import { EventoDto } from '../../models/evento.model';
import { EventCardComponent } from './event-card.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCardComponent],
  template: `
    <div class="event-grid">
      @for (evento of eventos; track evento.idEvento) {
        <app-event-card [evento]="evento" />
      }
    </div>
  `,
  styles: [`
    .event-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
  `]
})
export class EventListComponent {
  @Input({ required: true }) eventos!: EventoDto[];
}
