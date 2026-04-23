import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuarioDto, UsuarioPayload } from '../../../models/usuario.model';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/ui/confirm-dialog.component';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, ConfirmDialogComponent],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
})
export class AdminUsuariosComponent implements OnInit, OnDestroy {
  usuarios: UsuarioDto[] = [];
  form!: FormGroup;
  editing = false;
  editingUsername = '';
  showForm = false;
  deleteTarget: UsuarioDto | null = null;
  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
    });
    this.load();
  }

  load(): void {
    this.usuariosService.findAll().pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.usuarios = d;
      this.cdr.markForCheck();
    });
  }

  openNew(): void {
    this.editing = false;
    this.editingUsername = '';
    this.form.reset();
    this.form.get('username')?.enable();
    this.showForm = true;
  }

  openEdit(usuario: UsuarioDto): void {
    this.editing = true;
    this.editingUsername = usuario.email; // We don't have username in DTO, use email as identifier
    this.form.patchValue({
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      direccion: usuario.direccion,
    });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: UsuarioPayload = {
      username: v.username,
      password: v.password,
      email: v.email,
      nombre: v.nombre,
      apellidos: v.apellidos,
      direccion: v.direccion,
      enabled: 1,
      fechaRegistro: new Date().toISOString(),
    };
    const op$ = this.editing
      ? this.usuariosService.update(payload)
      : this.usuariosService.create(payload);
    op$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success(this.editing ? 'Usuario actualizado' : 'Usuario creado');
        this.showForm = false;
        this.cdr.markForCheck();
        this.load();
      },
      error: () => this.notification.error('Error al guardar'),
    });
  }

  confirmDelete(usuario: UsuarioDto): void {
    this.deleteTarget = usuario;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    // UsuarioDto doesn't have username; we'll use email for now
    this.usuariosService.deleteById(this.deleteTarget.email).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('Usuario eliminado');
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
