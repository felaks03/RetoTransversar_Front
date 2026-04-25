import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  submitting = false;
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private session: SessionService,
    private router: Router,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    const { username, password } = this.form.value;

    this.session.login(username, password).subscribe({
      next: (user) => {
        this.notification.success(`Bienvenido, ${user.username}`);
        if (user.rol === 'ROLE_ADMON') {
          this.router.navigate(['/admin/eventos']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.notification.error('Usuario o contraseña incorrectos');
        } else if (err.status === 403) {
          this.notification.error('Tu cuenta está desactivada');
        } else {
          this.notification.error('No se pudo conectar con el servidor');
        }
        this.submitting = false;
        this.cdr.markForCheck();
      },
    });
  }
}
