import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="overlay" (click)="cancelled.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="actions">
          <button class="btn-secondary" (click)="cancelled.emit()">Cancelar</button>
          <button class="btn-danger" (click)="confirmed.emit()">Confirmar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .dialog {
      background: #fff; border-radius: var(--radius); padding: 2rem;
      max-width: 400px; width: 90%;
    }
    .dialog h3 { margin: 0 0 0.5rem; }
    .dialog p { color: var(--text-muted); margin-bottom: 1.5rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
    .btn-secondary {
      padding: 0.5rem 1rem; border: 1px solid var(--border);
      background: #fff; border-radius: var(--radius); cursor: pointer;
    }
    .btn-danger {
      padding: 0.5rem 1rem; background: var(--danger); color: #fff;
      border: none; border-radius: var(--radius); cursor: pointer; font-weight: 600;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
