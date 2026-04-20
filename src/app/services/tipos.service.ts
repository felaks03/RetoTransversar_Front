import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDto } from '../models/tipo.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TiposService {
  private readonly url = `${environment.apiUrl}/tipos`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<TipoDto[]> {
    return this.http.get<TipoDto[]>(this.url);
  }

  findById(id: number): Observable<TipoDto> {
    return this.http.get<TipoDto>(`${this.url}/${id}`);
  }

  create(tipo: TipoDto): Observable<TipoDto> {
    return this.http.post<TipoDto>(`${this.url}/alta`, tipo);
  }

  update(tipo: TipoDto): Observable<TipoDto> {
    return this.http.put<TipoDto>(`${this.url}/actualizar`, tipo);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}
