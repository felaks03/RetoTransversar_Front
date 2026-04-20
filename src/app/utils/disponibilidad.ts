import { ReservaDto } from '../models/reserva.model';

export function calcularDisponibilidad(aforoMaximo: number, reservas: ReservaDto[]): number {
  const totalReservado = reservas.reduce((sum, r) => sum + r.cantidad, 0);
  return Math.max(0, aforoMaximo - totalReservado);
}
