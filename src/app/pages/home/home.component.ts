import { Component, OnInit, OnDestroy } from '@angular/core';
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
      },
      error: () => this.loading = false,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
