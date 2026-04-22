import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 0) {
        notifications.error('No se pudo conectar con el servidor');
      } else if (error.status === 404) {
        notifications.error('Recurso no encontrado (404)');
      } else if (error.status === 403) {
        notifications.error('No tienes permiso para realizar esta acción');
      } else if (error.status >= 500) {
        notifications.error('Error interno del servidor');
      }
      // El 401 lo gestionan los componentes individualmente
      return throwError(() => error);
    })
  );
};
