import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { EventoDto } from '../../models/evento.model';
import { EventListComponent } from '../../components/events/event-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, EventListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  destacados: EventoDto[] = [];
  activos: EventoDto[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    forkJoin({
      destacados: this.eventosService.findDestacados(),
      activos: this.eventosService.findActivos(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ destacados, activos }) => {
        this.destacados = destacados;
        this.activos = activos.slice(0, 6);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
