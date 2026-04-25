export interface ReservaDto {
  idReserva: number;
  idEvento: number;
  username: string;
  precioVenta: number;
  observaciones: string | null;
  cantidad: number;
}

export interface ReservaPayload {
  evento: { idEvento: number };
  usuario: { username: string };
  precioVenta: number;
  observaciones: string;
  cantidad: number;
}
