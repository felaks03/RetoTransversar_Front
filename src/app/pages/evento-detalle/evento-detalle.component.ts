import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EventosService } from '../../services/eventos.service';
import { ReservasService } from '../../services/reservas.service';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { TiposCacheService } from '../../services/tipos-cache.service';
import { EventoDto, Estado } from '../../models/evento.model';
import { ReservaDto, ReservaPayload } from '../../models/reserva.model';
import { calcularDisponibilidad } from '../../utils/disponibilidad';
import { EstadoBadgeComponent } from '../../components/ui/estado-badge.component';
import { ReservationFormComponent } from '../../components/reservations/reservation-form.component';

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, EstadoBadgeComponent, ReservationFormComponent],
  templateUrl: './evento-detalle.component.html',
  styleUrl: './evento-detalle.component.css',
})
export class EventoDetalleComponent implements OnInit, OnDestroy {
  evento?: EventoDto;
  reservas: ReservaDto[] = [];
  tipoNombre = '';
  disponibles = 0;
  plazasDisponiblesUsuario = 10;
  maxReservable = 0;
  loading = true;
  isLoggedIn = false;
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private reservasService: ReservasService,
    private session: SessionService,
    private notification: NotificationService,
    private tiposCache: TiposCacheService,
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(v => {
      this.isLoggedIn = v;
      this.updateReservationWindow();
      this.cdr.markForCheck();
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('idEvento'));
        return forkJoin({
          evento: this.eventosService.findById(id),
          reservas: this.reservasService.findByEvento(id),
        });
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: ({ evento, reservas }) => {
        this.evento = evento;
        this.reservas = reservas;
        this.updateReservationWindow();
        this.tiposCache.getNombreById(evento.idTipo)
          .pipe(takeUntil(this.destroy$))
          .subscribe(n => {
            this.tipoNombre = n;
            this.cdr.markForCheck();
          });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get isActivo(): boolean {
    return this.evento?.estado === Estado.ACTIVO;
  }

  get hasReachedReservationLimit(): boolean {
    return this.isLoggedIn && this.isActivo && this.disponibles > 0 && this.maxReservable <= 0;
  }

  onReservaSubmitted(payload: ReservaPayload): void {
    this.reservasService
      .reservar(payload.evento.idEvento, payload.usuario.username, payload.cantidad, payload.observaciones)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: () => {
        this.notification.success('Tu plaza ya está guardada y la verás en Mis reservas.', 'Reserva confirmada');
        this.refreshReservas();
      },
      error: (err) => {
        const message = typeof err.error === 'string' && err.error.trim()
          ? err.error
          : 'Error al realizar la reserva';
        this.notification.error(message, 'No se pudo confirmar la reserva');
      },
    });
  }

  private refreshReservas(): void {
    if (!this.evento) return;

    this.reservasService.findByEvento(this.evento.idEvento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(r => {
        this.reservas = r;
        this.updateReservationWindow();
        this.cdr.markForCheck();
      });
  }

  private updateReservationWindow(): void {
    if (!this.evento) return;

    this.disponibles = calcularDisponibilidad(this.evento.aforoMaximo, this.reservas);

    const username = this.session.currentUser?.username;
    if (!username) {
      this.plazasDisponiblesUsuario = 10;
      this.maxReservable = Math.min(this.disponibles, 10);
      return;
    }

    const reservasUsuario = this.reservas
      .filter(reserva => reserva.username === username)
      .reduce((total, reserva) => total + reserva.cantidad, 0);

    this.plazasDisponiblesUsuario = Math.max(0, 10 - reservasUsuario);
    this.maxReservable = Math.min(this.disponibles, this.plazasDisponiblesUsuario);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
