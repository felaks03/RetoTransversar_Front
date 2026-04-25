import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ReservaPayload } from '../../models/reserva.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css',
})
export class ReservationFormComponent implements OnChanges {
  @Input({ required: true }) idEvento!: number;
  @Input({ required: true }) precio!: number;
  @Input({ required: true }) disponibles!: number;
  @Input({ required: true }) maxReservable!: number;
  @Input({ required: true }) plazasDisponiblesUsuario!: number;
  @Output() submitted = new EventEmitter<ReservaPayload>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: SessionService,
  ) {
    this.form = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      observaciones: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['disponibles'] || changes['maxReservable']) && this.form) {
      this.form.get('cantidad')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(Math.max(this.maximoPermitido, 1)),
      ]);
      this.form.get('cantidad')?.updateValueAndValidity();
    }
  }

  get maximoPermitido(): number {
    return Math.min(this.disponibles, this.maxReservable);
  }

  get total(): number {
    const cant = this.form.get('cantidad')?.value ?? 0;
    return cant * this.precio;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const user = this.session.currentUser;
    if (!user) return;

    const payload: ReservaPayload = {
      evento: { idEvento: this.idEvento },
      usuario: { username: user.username },
      precioVenta: this.precio,
      observaciones: this.form.value.observaciones ?? '',
      cantidad: this.form.value.cantidad,
    };
    this.submitted.emit(payload);
  }
}
