import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoDto, EventoPayload } from '../models/evento.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly url = `${environment.apiUrl}/eventos`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(this.url);
  }

  findById(id: number): Observable<EventoDto> {
    return this.http.get<EventoDto>(`${this.url}/${id}`);
  }

  create(evento: EventoPayload): Observable<EventoDto> {
    return this.http.post<EventoDto>(`${this.url}/alta`, evento);
  }

  createActivo(evento: EventoPayload): Observable<EventoDto> {
    return this.http.post<EventoDto>(`${this.url}/alta-activo`, evento);
  }

  update(evento: EventoPayload): Observable<EventoDto> {
    return this.http.put<EventoDto>(`${this.url}/actualizar`, evento);
  }

  editById(id: number, evento: EventoPayload): Observable<EventoDto> {
    return this.http.put<EventoDto>(`${this.url}/editar/${id}`, evento);
  }

  cancelById(id: number): Observable<EventoDto> {
    return this.http.put<EventoDto>(`${this.url}/cancelar/${id}`, {});
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }

  findActivos(): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/por-estado-activo`);
  }

  findDestacados(): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/destacados`);
  }

  findTerminados(): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/terminados`);
  }

  findCancelados(): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/cancelados`);
  }

  findByTipo(idTipo: number): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/tipo/${idTipo}`);
  }

  findByEstado(estado: string): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/estado/${estado}`);
  }

  findByNombre(palabra: string): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/por-nombre/${encodeURIComponent(palabra)}`);
  }

  findByNombreDelTipo(nombre: string): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/por-nombre-del-tipo/${encodeURIComponent(nombre)}`);
  }

  findActivosDeUsuario(username: string): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(`${this.url}/activos-de-un-usuario/${encodeURIComponent(username)}`);
  }

  busquedaCombinada(nombre: string, direccion: string, precio: number | null): Observable<EventoDto[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (direccion) params = params.set('direccion', direccion);
    if (precio !== null) params = params.set('precio', precio.toString());
    return this.http.get<EventoDto[]>(`${this.url}/por-nombre-o-direccion-o-precio-maximo`, { params });
  }

  totalPorEstado(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.url}/total-por-estado`);
  }
}
