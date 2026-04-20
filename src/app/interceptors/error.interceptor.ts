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
        notifications.error('Recurso no encontrado');
      } else if (error.status >= 400 && error.status < 500) {
        notifications.error(error.error?.message || 'Error en la petición');
      } else if (error.status >= 500) {
        notifications.error('Error interno del servidor');
      }
      return throwError(() => error);
    })
  );
};
