import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TiposService } from '../../../services/tipos.service';
import { TipoDto } from '../../../models/tipo.model';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/ui/confirm-dialog.component';

@Component({
  selector: 'app-admin-tipos',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './admin-tipos.component.html',
  styleUrl: './admin-tipos.component.css',
})
export class AdminTiposComponent implements OnInit, OnDestroy {
  tipos: TipoDto[] = [];
  form!: FormGroup;
  editing: TipoDto | null = null;
  showForm = false;
  deleteTarget: TipoDto | null = null;
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private tiposService: TiposService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.load();
  }

  load(): void {
    this.tiposService.findAll().pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.tipos = d;
      this.cdr.markForCheck();
    });
  }

  openNew(): void {
    this.editing = null;
    this.form.reset();
    this.showForm = true;
  }

  openEdit(tipo: TipoDto): void {
    this.editing = tipo;
    this.form.patchValue({ nombre: tipo.nombre, descripcion: tipo.descripcion });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const data: TipoDto = {
      idTipo: this.editing?.idTipo ?? 0,
      ...this.form.value,
    };
    const op$ = this.editing ? this.tiposService.update(data) : this.tiposService.create(data);
    op$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success(this.editing ? 'Tipo actualizado' : 'Tipo creado');
        this.showForm = false;
        this.cdr.markForCheck();
        this.load();
      },
      error: () => this.notification.error('Error al guardar'),
    });
  }

  confirmDelete(tipo: TipoDto): void {
    this.deleteTarget = tipo;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.tiposService.deleteById(this.deleteTarget.idTipo).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('Tipo eliminado');
        this.deleteTarget = null;
        this.cdr.markForCheck();
        this.load();
      },
      error: () => {
        this.notification.error('Error al eliminar');
        this.deleteTarget = null;
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
