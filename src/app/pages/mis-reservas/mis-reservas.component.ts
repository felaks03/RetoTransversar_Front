import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, forkJoin, takeUntil, switchMap, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReservasService } from '../../services/reservas.service';
import { EventosService } from '../../services/eventos.service';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { ReservaDto } from '../../models/reserva.model';
import { EventoDto } from '../../models/evento.model';

interface ReservaEnriquecida {
  reserva: ReservaDto;
  evento?: EventoDto;
}

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
})
export class MisReservasComponent implements OnInit, OnDestroy {
  reservas: ReservaEnriquecida[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private reservasService: ReservasService,
    private eventosService: EventosService,
    private session: SessionService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    const user = this.session.currentUser;
    if (!user) {
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.reservasService.findByUsuarioActivo(user.username).pipe(
      switchMap(reservas => {
        if (reservas.length === 0) return of([]);
        const enriched$ = reservas.map(r =>
          this.eventosService.findById(r.idEvento).pipe(
            switchMap(evento => of({ reserva: r, evento } as ReservaEnriquecida)),
          )
        );
        return forkJoin(enriched$);
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: data => {
        this.reservas = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteReserva(id: number): void {
    this.reservasService.cancelarReserva(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.reserva.idReserva !== id);
        this.notification.success('La plaza ha quedado liberada correctamente.', 'Reserva cancelada');
        this.cdr.markForCheck();
      },
      error: (err) => {
        const message = typeof err.error === 'string' && err.error.trim()
          ? err.error
          : 'Error al cancelar la reserva';
        this.notification.error(message, 'No se pudo cancelar la reserva');
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
