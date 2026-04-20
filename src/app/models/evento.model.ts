export enum Estado {
  CANCELADO = 'CANCELADO',
  TERMINADO = 'TERMINADO',
  ACTIVO = 'ACTIVO',
}

export enum Destacado {
  S = 'S',
  N = 'N',
}

export interface EventoDto {
  idEvento: number;
  idTipo: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  duracion: number;
  direccion: string;
  estado: Estado;
  destacado: Destacado;
  aforoMaximo: number;
  minimoAsistencia: number;
  precio: number;
}

export interface EventoPayload {
  tipo: { idTipo: number };
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  duracion: number;
  direccion: string;
  estado: Estado;
  destacado: Destacado;
  aforoMaximo: number;
  minimoAsistencia: number;
  precio: number;
}
