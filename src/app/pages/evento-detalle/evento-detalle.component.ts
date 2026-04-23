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
        this.disponibles = calcularDisponibilidad(evento.aforoMaximo, reservas);
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

  onReservaSubmitted(payload: ReservaPayload): void {
    this.reservasService.create(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('Reserva realizada con éxito');
        // refresh availability
        if (this.evento) {
          this.reservasService.findByEvento(this.evento.idEvento)
            .pipe(takeUntil(this.destroy$))
            .subscribe(r => {
              this.reservas = r;
              this.disponibles = calcularDisponibilidad(this.evento!.aforoMaximo, r);
              this.cdr.markForCheck();
            });
        }
      },
      error: () => this.notification.error('Error al realizar la reserva'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
