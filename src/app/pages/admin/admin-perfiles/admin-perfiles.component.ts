import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PerfilesService } from '../../../services/perfiles.service';
import { PerfilDto } from '../../../models/perfil.model';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/ui/confirm-dialog.component';

@Component({
  selector: 'app-admin-perfiles',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './admin-perfiles.component.html',
  styleUrl: './admin-perfiles.component.css',
})
export class AdminPerfilesComponent implements OnInit, OnDestroy {
  perfiles: PerfilDto[] = [];
  form!: FormGroup;
  editing: PerfilDto | null = null;
  showForm = false;
  deleteTarget: PerfilDto | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private perfilesService: PerfilesService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
    });
    this.load();
  }

  load(): void {
    this.perfilesService.findAll().pipe(takeUntil(this.destroy$)).subscribe(d => this.perfiles = d);
  }

  openNew(): void {
    this.editing = null;
    this.form.reset();
    this.showForm = true;
  }

  openEdit(perfil: PerfilDto): void {
    this.editing = perfil;
    this.form.patchValue({ nombre: perfil.nombre });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const data: PerfilDto = {
      idPerfil: this.editing?.idPerfil ?? 0,
      ...this.form.value,
    };
    const op$ = this.editing ? this.perfilesService.update(data) : this.perfilesService.create(data);
    op$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success(this.editing ? 'Perfil actualizado' : 'Perfil creado');
        this.showForm = false;
        this.load();
      },
      error: () => this.notification.error('Error al guardar'),
    });
  }

  confirmDelete(perfil: PerfilDto): void {
    this.deleteTarget = perfil;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.perfilesService.deleteById(this.deleteTarget.idPerfil).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('Perfil eliminado');
        this.deleteTarget = null;
        this.load();
      },
      error: () => {
        this.notification.error('Error al eliminar');
        this.deleteTarget = null;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
