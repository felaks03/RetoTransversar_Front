import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$: Observable<Notification | null> = this.notificationSubject.asObservable();
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  success(message: string, title = 'Todo listo'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'No se pudo completar la accion'): void {
    this.show({ type: 'error', title, message });
  }

  info(message: string, title = 'Tenlo en cuenta'): void {
    this.show({ type: 'info', title, message });
  }

  clear(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
    this.notificationSubject.next(null);
  }

  private show(notification: Notification): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }

    this.notificationSubject.next(notification);
    this.autoClear();
  }

  private autoClear(): void {
    this.clearTimer = setTimeout(() => this.clear(), 5000);
  }
}
