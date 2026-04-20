import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  private _evento!: EventoDto;
  tipoNombre$: Observable<string> = of('');

  @Input({ required: true })
  set evento(value: EventoDto) {
    this._evento = value;
    this.tipoNombre$ = this.tiposCache.getNombreById(value.idTipo);
  }

  get evento(): EventoDto {
    return this._evento;
  }

  constructor(public tiposCache: TiposCacheService) {}

  get esDestacado(): boolean {
    return this.evento.destacado === Destacado.S;
  }
}
