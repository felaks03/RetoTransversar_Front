import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { TipoDto } from '../models/tipo.model';
import { TiposService } from './tipos.service';

@Injectable({ providedIn: 'root' })
export class TiposCacheService {
  private tipos$: Observable<TipoDto[]>;

  constructor(private tiposService: TiposService) {
    this.tipos$ = this.tiposService.findAll().pipe(shareReplay(1));
  }

  getAll(): Observable<TipoDto[]> {
    return this.tipos$;
  }

  getNombreById(idTipo: number): Observable<string> {
    return this.tipos$.pipe(
      map(tipos => {
        const tipo = tipos.find(t => t.idTipo === idTipo);
        return tipo ? tipo.nombre : 'Desconocido';
      })
    );
  }
}
