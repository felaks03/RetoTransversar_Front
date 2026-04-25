import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaDto, ReservaPayload } from '../models/reserva.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly url = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<ReservaDto[]> {
    return this.http.get<ReservaDto[]>(this.url);
  }

  findById(id: number): Observable<ReservaDto> {
    return this.http.get<ReservaDto>(`${this.url}/${id}`);
  }

  create(reserva: ReservaPayload): Observable<ReservaDto> {
    return this.http.post<ReservaDto>(`${this.url}/alta`, reserva);
  }

  update(reserva: ReservaPayload): Observable<ReservaDto> {
    return this.http.put<ReservaDto>(`${this.url}/actualizar`, reserva);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }

  findByUsuario(username: string): Observable<ReservaDto[]> {
    return this.http.get<ReservaDto[]>(`${this.url}/por-usuario/${encodeURIComponent(username)}`);
  }

  findByUsuarioActivo(username: string): Observable<ReservaDto[]> {
    return this.http.get<ReservaDto[]>(`${this.url}/por-usuario-activo/${encodeURIComponent(username)}`);
  }

  findByEvento(idEvento: number): Observable<ReservaDto[]> {
    return this.http.get<ReservaDto[]>(`${this.url}/por-evento/${idEvento}`);
  }

  reservar(idEvento: number, username: string, cantidad: number, observaciones?: string): Observable<string> {
    let params = `username=${encodeURIComponent(username)}&cantidad=${cantidad}`;
    if (observaciones) params += `&observaciones=${encodeURIComponent(observaciones)}`;
    return this.http.post(`${this.url}/reservar/${idEvento}?${params}`, {}, { responseType: 'text' });
  }

  cancelarReserva(idReserva: number): Observable<string> {
    return this.http.delete(`${this.url}/cancelar/${idReserva}`, { responseType: 'text' });
  }
}
