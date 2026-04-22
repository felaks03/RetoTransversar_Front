import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SessionUser {
  username: string;
  nombre?: string;
  rol: 'ROLE_ADMON' | 'ROLE_CLIENTE';
}

interface LoginResponse {
  token: string;
  username: string;
  rol: string;
}

const SESSION_KEY = 'reto_session';
const TOKEN_KEY = 'reto_token';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;

  private userSubject = new BehaviorSubject<SessionUser | null>(this.restore());

  currentUser$: Observable<SessionUser | null> = this.userSubject.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(u => u !== null));
  isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map(u => u?.rol === 'ROLE_ADMON')
  );

  constructor(private http: HttpClient) {}

  get currentUser(): SessionUser | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<SessionUser> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        const user: SessionUser = {
          username: response.username,
          rol: response.rol as SessionUser['rol'],
        };
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      }),
      map(response => ({
        username: response.username,
        rol: response.rol as SessionUser['rol'],
      }))
    );
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private restore(): SessionUser | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }
}
