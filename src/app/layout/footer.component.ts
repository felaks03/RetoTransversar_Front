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
      background: var(--surface);
      color: var(--text-muted);
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
      border-top: 1px solid var(--border);
      margin-top: auto;
    }
  `]
})
export class FooterComponent {}
