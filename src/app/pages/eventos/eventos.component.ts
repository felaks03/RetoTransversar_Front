import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventosService } from '../../services/eventos.service';
import { EventoDto } from '../../models/evento.model';
import { EventFilters, EventFiltersComponent } from '../../components/events/event-filters.component';
import { EventListComponent } from '../../components/events/event-list.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [EventFiltersComponent, EventListComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit, OnDestroy {
  eventos: EventoDto[] = [];
  filtered: EventoDto[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private filters: EventFilters = { tipoId: null, nombre: '', direccion: '', precioMaximo: null };
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.eventosService.findActivos().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.eventos = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onFiltersChanged(f: EventFilters): void {
    this.filters = f;
    this.applyFilters();
    this.cdr.markForCheck();
  }

  private applyFilters(): void {
    let result = [...this.eventos];
    const { tipoId, nombre, direccion, precioMaximo } = this.filters;

    if (tipoId) {
      result = result.filter(e => e.idTipo === tipoId);
    }
    if (nombre?.trim()) {
      const q = nombre.trim().toLowerCase();
      result = result.filter(e => e.nombre.toLowerCase().includes(q));
    }
    if (direccion?.trim()) {
      const q = direccion.trim().toLowerCase();
      result = result.filter(e => e.direccion.toLowerCase().includes(q));
    }
    if (precioMaximo != null && precioMaximo >= 0) {
      result = result.filter(e => e.precio <= precioMaximo);
    }
    this.filtered = result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
