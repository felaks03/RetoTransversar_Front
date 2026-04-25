import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsyncPipe],
  template: `
    <app-header />
    @if (notifications.notification$ | async; as notif) {
      <div class="notification-shell" [attr.aria-live]="notif.type === 'error' ? 'assertive' : 'polite'">
        <div class="notification" [class]="'notification notification--' + notif.type" [attr.role]="notif.type === 'error' ? 'alert' : 'status'">
          <div class="notification__icon" aria-hidden="true">
            {{ notif.type === 'success' ? '✓' : notif.type === 'error' ? '!' : 'i' }}
          </div>
          <div class="notification__content">
            <p class="notification__title">{{ notif.title }}</p>
            <p class="notification__message">{{ notif.message }}</p>
          </div>
          <button class="notification__close" (click)="notifications.clear()" aria-label="Cerrar notificacion">&times;</button>
        </div>
      </div>
    }
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }
    .notification-shell {
      position: fixed;
      top: 4.75rem;
      right: 1.25rem;
      z-index: 300;
      width: min(28rem, calc(100vw - 2rem));
      pointer-events: none;
    }
    .notification {
      display: flex;
      align-items: flex-start;
      gap: 0.9rem;
      padding: 1rem 1rem 1rem 0.95rem;
      border-radius: 16px;
      border: 1px solid var(--border-strong);
      background: linear-gradient(180deg, rgba(20, 24, 31, 0.96) 0%, rgba(13, 15, 20, 0.98) 100%);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(16px);
      pointer-events: auto;
      animation: notification-in 0.22s ease-out;
    }
    .notification--success {
      border-color: rgba(0, 210, 106, 0.28);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(0, 210, 106, 0.08) inset;
    }
    .notification--error {
      border-color: rgba(217, 12, 40, 0.28);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(217, 12, 40, 0.08) inset;
    }
    .notification--info {
      border-color: rgba(242, 13, 36, 0.24);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(242, 13, 36, 0.08) inset;
    }
    .notification__icon {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      flex: 0 0 auto;
      margin-top: 0.05rem;
      border: 1px solid transparent;
    }
    .notification--success .notification__icon {
      background: rgba(0, 210, 106, 0.14);
      color: #7ff0b1;
      border-color: rgba(0, 210, 106, 0.22);
    }
    .notification--error .notification__icon {
      background: rgba(217, 12, 40, 0.14);
      color: #ff8d9f;
      border-color: rgba(217, 12, 40, 0.22);
    }
    .notification--info .notification__icon {
      background: rgba(242, 13, 36, 0.14);
      color: #ff9aa5;
      border-color: rgba(242, 13, 36, 0.22);
    }
    .notification__content {
      flex: 1;
      min-width: 0;
    }
    .notification__title,
    .notification__message {
      margin: 0;
    }
    .notification__title {
      color: var(--color-neutral-900);
      font-size: 0.94rem;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 0.2rem;
    }
    .notification__message {
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.45;
    }
    .notification__close {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      flex: 0 0 auto;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    .notification__close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
      border-color: var(--border-strong);
    }
    @keyframes notification-in {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @media (max-width: 768px) {
      .notification-shell {
        top: 4.25rem;
        left: 1rem;
        right: 1rem;
        width: auto;
      }
    }
  `]
})
export class LayoutComponent {
  constructor(public notifications: NotificationService) {}
}
