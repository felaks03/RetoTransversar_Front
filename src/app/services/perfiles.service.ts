import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilDto } from '../models/perfil.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilesService {
  private readonly url = `${environment.apiUrl}/perfiles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PerfilDto[]> {
    return this.http.get<PerfilDto[]>(this.url);
  }

  findById(id: number): Observable<PerfilDto> {
    return this.http.get<PerfilDto>(`${this.url}/${id}`);
  }

  create(perfil: PerfilDto): Observable<PerfilDto> {
    return this.http.post<PerfilDto>(`${this.url}/alta`, perfil);
  }

  update(perfil: PerfilDto): Observable<PerfilDto> {
    return this.http.put<PerfilDto>(`${this.url}/actualizar`, perfil);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}
