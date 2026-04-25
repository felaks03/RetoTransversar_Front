import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 0) {
        notifications.error('Comprueba la conexion e intentalo otra vez.', 'Sin conexion');
      } else if (error.status === 404) {
        notifications.error('Lo que buscas ya no esta disponible o no existe.', 'Contenido no encontrado');
      } else if (error.status === 403) {
        notifications.error('Tu sesion no tiene permisos para esta accion.', 'Acceso denegado');
      } else if (error.status >= 500) {
        notifications.error('El servidor ha respondido con un error inesperado.', 'Problema en el servidor');
      }
      // El 401 lo gestionan los componentes individualmente
      return throwError(() => error);
    })
  );
};
