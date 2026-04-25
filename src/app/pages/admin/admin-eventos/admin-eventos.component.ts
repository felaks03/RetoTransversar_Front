import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { EventosService } from '../../../services/eventos.service';
import { TiposService } from '../../../services/tipos.service';
import { EventoDto, EventoPayload, Estado, Destacado } from '../../../models/evento.model';
import { TipoDto } from '../../../models/tipo.model';
import { NotificationService } from '../../../services/notification.service';
import { EstadoBadgeComponent } from '../../../components/ui/estado-badge.component';
import { ConfirmDialogComponent } from '../../../components/ui/confirm-dialog.component';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, EstadoBadgeComponent, ConfirmDialogComponent],
  templateUrl: './admin-eventos.component.html',
  styleUrl: './admin-eventos.component.css',
})
export class AdminEventosComponent implements OnInit, OnDestroy {
  eventos: EventoDto[] = [];
  tipos: TipoDto[] = [];
  form!: FormGroup;
  editing: EventoDto | null = null;
  showForm = false;
  deleteTarget: EventoDto | null = null;
  estados = Object.values(Estado);
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private tiposService: TiposService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idTipo: [null, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      duracion: [1, [Validators.required, Validators.min(1)]],
      direccion: ['', Validators.required],
      estado: [Estado.ACTIVO, Validators.required],
      destacado: [Destacado.N, Validators.required],
      aforoMaximo: [1, [Validators.required, Validators.min(1)]],
      minimoAsistencia: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0)]],
    });
    this.tiposService.findAll().pipe(takeUntil(this.destroy$)).subscribe(t => {
      this.tipos = t;
      this.cdr.markForCheck();
    });
    this.load();
  }

  load(): void {
    this.eventosService.findAll().pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.eventos = d;
      this.cdr.markForCheck();
    });
  }

  openNew(): void {
    this.editing = null;
    this.form.reset({ estado: Estado.ACTIVO, destacado: Destacado.N, duracion: 1, aforoMaximo: 1, minimoAsistencia: 0, precio: 0 });
    this.showForm = true;
  }

  openEdit(evento: EventoDto): void {
    this.editing = evento;
    this.form.patchValue({
      ...evento,
      fechaInicio: evento.fechaInicio?.substring(0, 16), // datetime-local format
    });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: EventoPayload = {
      tipo: { idTipo: v.idTipo },
      nombre: v.nombre,
      descripcion: v.descripcion,
      fechaInicio: v.fechaInicio,
      duracion: v.duracion,
      direccion: v.direccion,
      estado: v.estado,
      destacado: v.destacado,
      aforoMaximo: v.aforoMaximo,
      minimoAsistencia: v.minimoAsistencia,
      precio: v.precio,
    };
    const op$ = this.editing
      ? this.eventosService.editById(this.editing.idEvento, payload)
      : this.eventosService.create(payload);
    op$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success(
          this.editing ? 'Los cambios ya estan guardados.' : 'El evento se ha creado correctamente.',
          this.editing ? 'Evento actualizado' : 'Evento creado'
        );
        this.showForm = false;
        this.cdr.markForCheck();
        this.load();
      },
      error: () => this.notification.error('Revisa los datos e intentalo de nuevo.', 'No se pudo guardar el evento'),
    });
  }

  cancelEvento(evento: EventoDto): void {
    this.eventosService.cancelById(evento.idEvento).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('El evento ha pasado a estado cancelado.', 'Evento cancelado');
        this.cdr.markForCheck();
        this.load();
      },
      error: () => this.notification.error('No hemos podido cambiar el estado del evento.', 'Cancelacion pendiente'),
    });
  }

  confirmDelete(evento: EventoDto): void {
    this.deleteTarget = evento;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.eventosService.deleteById(this.deleteTarget.idEvento).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('El evento se ha retirado del catalogo.', 'Evento eliminado');
        this.deleteTarget = null;
        this.cdr.markForCheck();
        this.load();
      },
      error: () => {
        this.notification.error('No hemos podido eliminar el evento.', 'Eliminacion pendiente');
        this.deleteTarget = null;
        this.cdr.markForCheck();
      },
    });
  }

  getTipoNombre(idTipo: number): string {
    return this.tipos.find(t => t.idTipo === idTipo)?.nombre ?? '—';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
