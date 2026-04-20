import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UsuariosService } from './usuarios.service';

export interface SessionUser {
  username: string;
  nombre: string;
  rol: 'admin' | 'cliente';
}

const STORAGE_KEY = 'reto_session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private userSubject = new BehaviorSubject<SessionUser | null>(this.restore());

  currentUser$: Observable<SessionUser | null> = this.userSubject.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(u => u !== null));
  isAdmin$: Observable<boolean> = this.currentUser$.pipe(map(u => u?.rol === 'admin'));

  constructor(private usuariosService: UsuariosService) {}

  get currentUser(): SessionUser | null {
    return this.userSubject.value;
  }

  login(username: string, rol: 'admin' | 'cliente'): Observable<SessionUser> {
    return new Observable(subscriber => {
      this.usuariosService.findById(username).subscribe({
        next: (dto) => {
          const user: SessionUser = { username, nombre: dto.nombre, rol };
          this.userSubject.next(user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          subscriber.next(user);
          subscriber.complete();
        },
        error: (err) => subscriber.error(err),
      });
    });
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private restore(): SessionUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }
}
