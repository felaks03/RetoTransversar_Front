import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$: Observable<Notification | null> = this.notificationSubject.asObservable();

  success(message: string): void {
    this.notificationSubject.next({ type: 'success', message });
    this.autoClear();
  }

  error(message: string): void {
    this.notificationSubject.next({ type: 'error', message });
    this.autoClear();
  }

  info(message: string): void {
    this.notificationSubject.next({ type: 'info', message });
    this.autoClear();
  }

  clear(): void {
    this.notificationSubject.next(null);
  }

  private autoClear(): void {
    setTimeout(() => this.clear(), 5000);
  }
}
