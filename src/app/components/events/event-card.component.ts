import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EventoDto, Destacado } from '../../models/evento.model';
import { EstadoBadgeComponent } from '../ui/estado-badge.component';
import { PriceTagComponent } from '../ui/price-tag.component';
import { TiposCacheService } from '../../services/tipos-cache.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, EstadoBadgeComponent, PriceTagComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  @Input({ required: true }) evento!: EventoDto;

  constructor(public tiposCache: TiposCacheService) {}

  get tipoNombre$() {
    return this.tiposCache.getNombreById(this.evento.idTipo);
  }

  get esDestacado(): boolean {
    return this.evento.destacado === Destacado.S;
  }
}
