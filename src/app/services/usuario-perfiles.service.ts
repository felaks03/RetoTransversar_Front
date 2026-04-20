import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioPerfilDto, UsuarioPerfilPayload } from '../models/usuario-perfil.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioPerfilesService {
  private readonly url = `${environment.apiUrl}/usuario-perfiles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<UsuarioPerfilDto[]> {
    return this.http.get<UsuarioPerfilDto[]>(this.url);
  }

  findById(id: number): Observable<UsuarioPerfilDto> {
    return this.http.get<UsuarioPerfilDto>(`${this.url}/${id}`);
  }

  create(payload: UsuarioPerfilPayload): Observable<UsuarioPerfilDto> {
    return this.http.post<UsuarioPerfilDto>(`${this.url}/alta`, payload);
  }

  update(payload: UsuarioPerfilPayload): Observable<UsuarioPerfilDto> {
    return this.http.put<UsuarioPerfilDto>(`${this.url}/actualizar`, payload);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}
