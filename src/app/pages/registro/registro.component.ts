import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsuariosService } from '../../services/usuarios.service';
import { UsuarioPayload } from '../../models/usuario.model';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  submitting = false;

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(45)]],
    password: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    nombre: ['', [Validators.required, Validators.maxLength(30)]],
    apellidos: ['', [Validators.required, Validators.maxLength(45)]],
    direccion: ['', [Validators.maxLength(100)]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.submitting) {
      return;
    }

    const value = this.form.getRawValue();
    const payload: UsuarioPayload = {
      username: value.username?.trim() ?? '',
      password: value.password ?? '',
      email: value.email?.trim() ?? '',
      nombre: value.nombre?.trim() ?? '',
      apellidos: value.apellidos?.trim() ?? '',
      direccion: value.direccion?.trim() ?? '',
      enabled: 1,
      fechaRegistro: this.todayAsIsoDate(),
    };

    this.submitting = true;
    this.usuariosService.registro(payload).subscribe({
      next: () => {
        this.notification.success('Cuenta creada. Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting = false;
        this.notification.error(this.getErrorMessage(err));
        this.cdr.markForCheck();
      },
    });
  }

  private todayAsIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private getErrorMessage(err: { status?: number; error?: unknown }): string {
    if (typeof err.error === 'string' && err.error.trim()) {
      return err.error;
    }

    if (err.status === 409) {
      return 'El nombre de usuario ya está en uso.';
    }

    if (err.status === 400) {
      return 'Revisa los datos del formulario antes de enviar.';
    }

    return 'No se pudo completar el registro.';
  }
}