import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto, UsuarioPayload } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(this.url);
  }

  findById(username: string): Observable<UsuarioDto> {
    return this.http.get<UsuarioDto>(`${this.url}/${encodeURIComponent(username)}`);
  }

  create(usuario: UsuarioPayload): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(`${this.url}/alta`, usuario);
  }

  update(usuario: UsuarioPayload): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(`${this.url}/actualizar`, usuario);
  }

  deleteById(username: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${encodeURIComponent(username)}`);
  }

  findByEmail(texto: string): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(`${this.url}/email/${encodeURIComponent(texto)}`);
  }

  findConReserva(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(`${this.url}/con-reserva`);
  }
}
