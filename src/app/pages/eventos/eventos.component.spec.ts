import { Component, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Destacado, Estado, EventoDto } from '../../models/evento.model';
import { EventosService } from '../../services/eventos.service';
import { EventFilters, EventFiltersComponent } from '../../components/events/event-filters.component';
import { EventListComponent } from '../../components/events/event-list.component';
import { EventosComponent } from './eventos.component';

@Component({
  selector: 'app-event-filters',
  template: '',
})
class StubEventFiltersComponent {
  readonly filtersChanged = output<EventFilters>();
}

@Component({
  selector: 'app-event-list',
  template: `<div class="stub-list">{{ eventos().length }}</div>`,
})
class StubEventListComponent {
  readonly eventos = input.required<readonly EventoDto[]>();
}

describe('EventosComponent', () => {
  let activos$: Subject<EventoDto[]>;

  beforeEach(async () => {
    activos$ = new Subject<EventoDto[]>();

    TestBed.configureTestingModule({
      imports: [EventosComponent],
      providers: [
        {
          provide: EventosService,
          useValue: {
            findActivos: () => activos$.asObservable(),
          },
        },
      ],
    });

    TestBed.overrideComponent(EventosComponent, {
      remove: { imports: [EventFiltersComponent, EventListComponent] },
      add: { imports: [StubEventFiltersComponent, StubEventListComponent] },
    });

    await TestBed.compileComponents();
  });

  it('renders the event list after async loading finishes', async () => {
    const fixture = TestBed.createComponent(EventosComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.spinner-container')).not.toBeNull();

    activos$.next([createEvento(1)]);
    activos$.complete();

    await fixture.whenStable();

    expect(element.querySelector('.spinner-container')).toBeNull();
    expect(element.querySelector('.stub-list')?.textContent).toContain('1');
  });
});

function createEvento(idEvento: number): EventoDto {
  return {
    idEvento,
    idTipo: 1,
    nombre: `Evento ${idEvento}`,
    descripcion: 'Descripcion',
    fechaInicio: '2026-04-23T18:00:00',
    duracion: 2,
    direccion: 'Calle Falsa 123',
    estado: Estado.ACTIVO,
    destacado: Destacado.N,
    aforoMaximo: 100,
    minimoAsistencia: 10,
    precio: 25,
  };
}