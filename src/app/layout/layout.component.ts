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
      <div class="notification" [class]="'notification--' + notif.type" role="alert">
        {{ notif.message }}
        <button class="notification__close" (click)="notifications.clear()" aria-label="Cerrar">&times;</button>
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
    .notification {
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .notification--success { background: #fafafa; color: #333; border-left: 3px solid #333; }
    .notification--error   { background: #fafafa; color: #333; border-left: 3px solid #999; }
    .notification--info    { background: #fafafa; color: #333; border-left: 3px solid #bbb; }
    .notification__close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: inherit;
      padding: 0 0.5rem;
    }
  `]
})
export class LayoutComponent {
  constructor(public notifications: NotificationService) {}
}
