import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private session: SessionService,
    private router: Router,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      rol: ['cliente', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    const { username, rol } = this.form.value;

    this.session.login(username, rol).subscribe({
      next: () => {
        this.notification.success(`Bienvenido, ${username}`);
        this.router.navigate(['/']);
      },
      error: () => {
        this.notification.error('Usuario no encontrado');
        this.submitting = false;
      },
    });
  }
}
