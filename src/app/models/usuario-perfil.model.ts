export interface UsuarioPerfilDto {
  idUsuarioPerfil: number;
  idPerfil: number;
}

export interface UsuarioPerfilPayload {
  usuario: { username: string };
  perfil: { idPerfil: number };
}
