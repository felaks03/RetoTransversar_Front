import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { Destacado, Estado, EventoDto } from '../../models/evento.model';
import { EventListComponent } from '../../components/events/event-list.component';
import { EventosService } from '../../services/eventos.service';
import { HomeComponent } from './home.component';

@Component({
  selector: 'app-event-list',
  template: `<div class="stub-list">{{ eventos().length }}</div>`,
})
class StubEventListComponent {
  readonly eventos = input.required<readonly EventoDto[]>();
}

describe('HomeComponent', () => {
  let destacados$: Subject<EventoDto[]>;
  let activos$: Subject<EventoDto[]>;

  beforeEach(async () => {
    destacados$ = new Subject<EventoDto[]>();
    activos$ = new Subject<EventoDto[]>();

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: EventosService,
          useValue: {
            findDestacados: () => destacados$.asObservable(),
            findActivos: () => activos$.asObservable(),
          },
        },
      ],
    });

    TestBed.overrideComponent(HomeComponent, {
      remove: { imports: [EventListComponent] },
      add: { imports: [StubEventListComponent] },
    });

    await TestBed.compileComponents();
  });

  it('removes the loading spinner after async event data arrives', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.spinner-container')).not.toBeNull();

    destacados$.next([createEvento(1)]);
    destacados$.complete();
    activos$.next([createEvento(2)]);
    activos$.complete();

    await fixture.whenStable();

    expect(element.querySelector('.spinner-container')).toBeNull();
    expect(element.querySelectorAll('.stub-list')).toHaveLength(2);
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
    destacado: Destacado.S,
    aforoMaximo: 100,
    minimoAsistencia: 10,
    precio: 25,
  };
}