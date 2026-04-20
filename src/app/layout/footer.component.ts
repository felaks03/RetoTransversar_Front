import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="main-footer">
      <p>Reto Transversal &copy; 2026 — Gestión de Eventos</p>
    </footer>
  `,
  styles: [`
    .main-footer {
      background: var(--color-neutral-100, #f5f5f5);
      color: var(--color-neutral-600, #666);
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
      border-top: 1px solid var(--color-neutral-200, #e5e5e5);
      margin-top: auto;
    }
  `]
})
export class FooterComponent {}
