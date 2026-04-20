export interface UsuarioDto {
  email: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  fechaRegistro: string;
}

export interface UsuarioPayload {
  username: string;
  password: string;
  email: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  enabled: number;
  fechaRegistro: string;
}
