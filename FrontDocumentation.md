# FrontDocumentation

## 1. Objetivo de este documento

Este documento describe la parte de frontend del reto transversal, pero ya **adaptada al backend real** que existe en la carpeta hermana del front:

- Frontend: `../RetoTransversar_Front`
- Backend: `../reto_entrenamiento_examen`

El contenido mezcla dos referencias:

1. Lo que exige el PDF del reto.
2. Lo que realmente ofrece hoy el backend Spring Boot del proyecto.

La idea no es documentar un backend ideal, sino dejar claro:

- que puede consumir ya el frontend,
- que pantallas encajan de forma directa con la API actual,
- que limitaciones tecnicas existen,
- y que partes del reto siguen pendientes del lado servidor.

## 2. Fuentes revisadas

- PDF del reto: `reto DAW v3.pdf`
- Rubrica de puntuacion trasladada desde `README.md`
- Codigo del backend en `../reto_entrenamiento_examen`

## 3. Estado actual del proyecto

### 3.1. Frontend actual

El frontend actual esta creado con:

- React 19
- Vite 8
- estructura minima de `src/`
- plantilla base de Vite en `App.jsx`

Todavia no implementa la SPA del reto.

### 3.2. Backend real disponible

El backend de la carpeta hermana es una API REST con:

| Elemento | Implementacion real |
| --- | --- |
| Lenguaje | Java 21 |
| Framework | Spring Boot 4.0.3 |
| Web | `spring-boot-starter-webmvc` |
| Persistencia | Spring Data JPA |
| Base de datos | MySQL |
| Puerto | `8095` |
| Documentacion API | Dependencia `springdoc-openapi-starter-webmvc-ui` |
| Validacion | Dependencia de Spring Validation incluida |

### 3.3. Configuracion detectada en `application.properties`

- `server.port=8095`
- `spring.datasource.url=jdbc:mysql://localhost:3306/reto?serverTimezone=UTC`
- usuario MySQL: `root`
- password MySQL: `1234`
- `spring.jpa.generate-ddl=false`
- `spring.jpa.show-sql=true`

### 3.4. Lo que **no** aparece implementado en el backend

En el codigo revisado **no se ha encontrado**:

- Spring Security
- JWT
- endpoints de login
- endpoints de registro separados del CRUD general
- guardas reales por rol
- anotaciones de validacion como `@NotBlank`, `@Email`, `@Min`, `@Max`
- reglas de negocio fuertes en servicios para reservas
- configuracion `@CrossOrigin`

Esto es clave para el frontend porque cambia bastante la estrategia de integracion.

## 4. Modelo de datos real del backend

El backend no esta montado solo alrededor de "eventos" y "reservas"; tambien expone usuarios, perfiles, tipos y relaciones usuario-perfil.

### 4.1. `Tipo`

Tabla: `tipos`

Campos reales:

- `idTipo`
- `nombre`
- `descripcion`

Uso en el front:

- poblar filtros por tipo,
- etiquetar eventos,
- mantener la gestion administrativa de categorias.

### 4.2. `Evento`

Tabla: `eventos`

Campos reales:

- `idEvento`
- `tipo`
- `nombre`
- `descripcion`
- `fechaInicio`
- `duracion`
- `direccion`
- `estado`
- `destacado`
- `aforoMaximo`
- `minimoAsistencia`
- `precio`

Enums detectados:

- `Estado`: `CANCELADO`, `TERMINADO`, `ACTIVO`
- `Destacado`: `S`, `N`

Uso en el front:

- home,
- listados,
- tarjetas,
- detalle,
- filtros,
- panel de administracion,
- estado visual del evento.

### 4.3. `Usuario`

Tabla: `usuarios`

Campos reales:

- `username`
- `password`
- `email`
- `nombre`
- `apellidos`
- `direccion`
- `enabled`
- `fechaRegistro`

Uso en el front:

- alta y mantenimiento de usuarios,
- futura autenticacion,
- relacion con reservas,
- relacion con perfiles.

### 4.4. `Perfil`

Tabla: `perfiles`

Campos reales:

- `idPerfil`
- `nombre`

Uso en el front:

- soporte conceptual para roles,
- mantenimiento administrativo,
- futura separacion entre admin y cliente.

### 4.5. `UsuarioPerfil`

Tabla: `usuario_perfiles`

Campos reales:

- `idUsuarioPerfil`
- `usuario`
- `perfil`

Uso en el front:

- asociar usuarios a perfiles,
- construir una futura logica por rol,
- administracion de permisos.

### 4.6. `Reserva`

Tabla: `reservas`

Campos reales:

- `idReserva`
- `evento`
- `usuario`
- `precioVenta`
- `observaciones`
- `cantidad`

Uso en el front:

- crear reservas,
- listar reservas por usuario,
- cancelar reservas,
- consultar reservas por evento,
- preparar pantallas de "Mis reservas".

## 5. DTOs reales que devuelve la API

Esto es especialmente importante porque el backend **no devuelve siempre la entidad completa**, sino DTOs recortados.

### 5.1. `EventoDto`

Devuelve:

- `idEvento`
- `idTipo`
- `nombre`
- `descripcion`
- `fechaInicio`
- `duracion`
- `direccion`
- `estado`
- `destacado`
- `aforoMaximo`
- `minimoAsistencia`
- `precio`

Implicacion para el front:

- se puede pintar bastante bien el evento,
- pero si se quiere mostrar el nombre del tipo, hace falta consultar `tipos` o mantener un mapa `idTipo -> nombre`.

### 5.2. `ReservaDto`

Devuelve:

- `idReserva`
- `idEvento`
- `precioVenta`
- `cantidad`

Implicacion para el front:

- la respuesta de reservas **no trae username**,
- tampoco trae nombre del evento,
- tampoco devuelve `observaciones`,
- asi que para una pantalla rica de "Mis reservas" habra que cruzar datos con eventos y con el contexto local del usuario.

### 5.3. `UsuarioDto`

Devuelve:

- `email`
- `nombre`
- `apellidos`
- `direccion`
- `fechaRegistro`

Implicacion para el front:

- el DTO **no incluye `username`**,
- eso complica mucho una pantalla administrativa de usuarios porque los endpoints de detalle, actualizacion o borrado usan `username` como identificador.

### 5.4. `PerfilDto`

Devuelve:

- `idPerfil`
- `nombre`

Sin problemas especiales para el front.

### 5.5. `UsuarioPerfilDto`

Devuelve:

- `idUsuarioPerfil`
- `idPerfil`

Implicacion para el front:

- **no incluye username**,
- por tanto, con la API actual no se puede reconstruir bien desde el cliente que usuario tiene cada perfil solo a partir de este DTO.

## 6. Diferencia entre modelo de lectura y modelo de escritura

El backend responde con DTOs, pero en `POST` y `PUT` los controladores reciben directamente las **entidades JPA**.

Eso significa que el frontend no puede asumir que el payload de escritura sea igual al JSON recibido en un `GET`.

### 6.1. Consecuencia general

Para crear o actualizar recursos, el frontend debe enviar una estructura compatible con las entidades del backend.

### 6.2. Ejemplo orientativo para alta de evento

```json
{
  "tipo": { "idTipo": 1 },
  "nombre": "Concierto Primavera",
  "descripcion": "Evento de prueba",
  "fechaInicio": "2026-05-30",
  "duracion": 120,
  "direccion": "Calle Mayor 10",
  "estado": "ACTIVO",
  "destacado": "S",
  "aforoMaximo": 300,
  "minimoAsistencia": 50,
  "precio": 25.0
}
```

### 6.3. Ejemplo orientativo para crear una reserva

```json
{
  "evento": { "idEvento": 1 },
  "usuario": { "username": "felix" },
  "precioVenta": 25.0,
  "observaciones": "Dos entradas juntas",
  "cantidad": 2
}
```

### 6.4. Implicacion tecnica para React

Conviene separar en el front:

- modelos de respuesta de la API,
- modelos de formulario,
- adaptadores para transformar formularios en payloads de escritura.

## 7. Endpoints reales del backend utiles para el frontend

La base URL local del backend es:

```text
http://localhost:8095
```

### 7.1. Endpoints de eventos

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/eventos` | Listado general de eventos |
| GET | `/eventos/{idEvento}` | Detalle de evento |
| POST | `/eventos/alta` | Alta de evento con estado enviado por el cliente |
| POST | `/eventos/alta-activo` | Alta de evento forzando `ACTIVO` |
| PUT | `/eventos/actualizar` | Actualizacion general |
| PUT | `/eventos/editar/{idEvento}` | Edicion por id |
| PUT | `/eventos/cancelar/{idEvento}` | Cancela un evento |
| DELETE | `/eventos/eliminar/{idEvento}` | Elimina un evento |
| GET | `/eventos/por-estado-activo` | Listado de eventos activos |
| GET | `/eventos/destacados` | Listado de eventos destacados |
| GET | `/eventos/terminados` | Listado de eventos terminados |
| GET | `/eventos/cancelados` | Listado de eventos cancelados |
| GET | `/eventos/tipo/{idTipo}` | Filtrar por tipo |
| GET | `/eventos/estado/{estado}` | Filtrar por enum de estado |
| GET | `/eventos/por-nombre/{palabra}` | Buscar por nombre |
| GET | `/eventos/por-nombre-del-tipo/{nombre}` | Buscar por nombre del tipo |
| GET | `/eventos/aforo-maximo-menor-de/{cantidad}` | Filtro por aforo |
| GET | `/eventos/duracion-mayor-que/{duracion}` | Filtro por duracion |
| GET | `/eventos/activos-de-un-usuario/{username}` | Eventos activos ligados a un usuario |
| GET | `/eventos/por-nombre-o-direccion-o-precio-maximo?nombre=&direccion=&precio=` | Busqueda combinada |
| GET | `/eventos/con-mas-de-n-reservas/{n}` | Consulta estadistica |
| GET | `/eventos/total-por-estado` | Conteo agrupado por estado |

### 7.2. Endpoints de tipos

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/tipos` | Listado de tipos para filtros o admin |
| GET | `/tipos/{idTipo}` | Detalle de tipo |
| POST | `/tipos/alta` | Alta de tipo |
| PUT | `/tipos/actualizar` | Edicion de tipo |
| DELETE | `/tipos/eliminar/{idTipo}` | Borrado de tipo |

### 7.3. Endpoints de reservas

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/reservas` | Listado general de reservas |
| GET | `/reservas/{idReserva}` | Detalle de reserva |
| POST | `/reservas/alta` | Crear reserva |
| PUT | `/reservas/actualizar` | Actualizar reserva |
| DELETE | `/reservas/eliminar/{idReserva}` | Cancelar o borrar reserva |
| GET | `/reservas/por-usuario/{username}` | Reservas de un usuario |
| GET | `/reservas/por-usuario-activo/{username}` | Reservas de un usuario con evento activo |
| GET | `/reservas/por-evento/{idEvento}` | Reservas de un evento |
| GET | `/reservas/por-nombre-de-tipo-de-evento/{nombre}` | Reservas por tipo de evento |
| GET | `/reservas/perfil-concreto/{idPerfil}` | Reservas de usuarios con un perfil concreto |
| GET | `/reservas/usuario-evento-activo-ultimo-mes/{username}` | Consulta temporal por usuario |
| GET | `/reservas/total-reservada-por-usuario-activo` | Suma de entradas por usuario |

### 7.4. Endpoints de usuarios

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/usuarios` | Listado general de usuarios |
| GET | `/usuarios/{username}` | Detalle de usuario |
| POST | `/usuarios/alta` | Alta de usuario |
| PUT | `/usuarios/actualizar` | Edicion de usuario |
| DELETE | `/usuarios/eliminar/{username}` | Borrado de usuario |
| GET | `/usuarios/email/{texto}` | Busqueda por email |
| GET | `/usuarios/fecha/{fechaRegistro}` | Busqueda por fecha de alta |
| GET | `/usuarios/con-reserva` | Usuarios con alguna reserva |
| GET | `/usuarios/con-mas-de-n-reservas/{n}` | Consulta estadistica |

### 7.5. Endpoints de perfiles

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/perfiles` | Listado de perfiles |
| GET | `/perfiles/{idPerfil}` | Detalle de perfil |
| POST | `/perfiles/alta` | Alta de perfil |
| PUT | `/perfiles/actualizar` | Edicion de perfil |
| DELETE | `/perfiles/eliminar/{idPerfil}` | Borrado de perfil |

### 7.6. Endpoints de usuario-perfiles

| Metodo | Ruta | Uso real desde el front |
| --- | --- | --- |
| GET | `/usuario-perfiles` | Listado de relaciones usuario-perfil |
| GET | `/usuario-perfiles/{idUsuarioPerfil}` | Detalle de relacion |
| POST | `/usuario-perfiles/alta` | Alta de relacion |
| PUT | `/usuario-perfiles/actualizar` | Edicion de relacion |
| DELETE | `/usuario-perfiles/eliminar/{idUsuarioPerfil}` | Borrado de relacion |

## 8. Como encaja el frontend del reto con esta API

### 8.1. Home publica

Puede montarse ya con:

- `GET /eventos/destacados`
- `GET /eventos/por-estado-activo`

Ideal para:

- hero principal,
- carrusel o grid de destacados,
- segunda seccion con eventos activos.

### 8.2. Filtros de eventos

Puede montarse ya con:

- `GET /tipos`
- `GET /eventos/tipo/{idTipo}`
- `GET /eventos/por-nombre/{palabra}`
- `GET /eventos/por-nombre-o-direccion-o-precio-maximo`

### 8.3. Detalle del evento

Puede montarse ya con:

- `GET /eventos/{idEvento}`

Si se quiere mostrar disponibilidad real, habria que combinarlo con:

- `GET /reservas/por-evento/{idEvento}`

para calcular el total reservado y deducir plazas libres.

### 8.4. Mis reservas

Puede montarse ya con:

- `GET /reservas/por-usuario/{username}`

o, si solo interesan las activas:

- `GET /reservas/por-usuario-activo/{username}`

Para cancelar:

- `DELETE /reservas/eliminar/{idReserva}`

### Limitacion importante

Como `ReservaDto` no trae nombre del evento, la pantalla necesitara:

- un segundo fetch por cada `idEvento`, o
- un cache local de eventos ya cargados.

### 8.5. Alta de reserva

No existe un endpoint estilo `/clientes/reservar/{id}` como en el PDF. En el backend real la reserva se hace con:

- `POST /reservas/alta`

Eso obliga al frontend a construir el payload manualmente con:

- `evento.idEvento`
- `usuario.username`
- `precioVenta`
- `cantidad`
- `observaciones`

### 8.6. Panel de administracion de eventos

Puede montarse ya con:

- `GET /eventos`
- `POST /eventos/alta-activo`
- `PUT /eventos/editar/{idEvento}`
- `PUT /eventos/cancelar/{idEvento}`
- `DELETE /eventos/eliminar/{idEvento}`

### 8.7. Panel de administracion de tipos y perfiles

Puede montarse ya con:

- `GET/POST/PUT/DELETE` sobre `/tipos`
- `GET/POST/PUT/DELETE` sobre `/perfiles`

### 8.8. Panel de administracion de usuarios

Existe CRUD real, pero con un problema importante:

- `GET /usuarios` devuelve `UsuarioDto` sin `username`

Eso hace que una tabla de usuarios no tenga de forma natural el identificador que luego piden:

- `GET /usuarios/{username}`
- `DELETE /usuarios/eliminar/{username}`

Por tanto, para una UI administrativa completa de usuarios, el backend actual se queda corto a nivel de contrato de lectura.

### 8.9. Gestion de roles

A nivel de base de datos y entidades, si existe el concepto de perfiles y asignaciones usuario-perfil.

Pero para el frontend hay un bloqueo importante:

- `UsuarioPerfilDto` no devuelve `username`
- no hay autenticacion
- no hay autorizacion
- no hay endpoint de "usuario actual"

Resultado:

- el concepto de rol existe en el dominio,
- pero **no esta listo para una experiencia de login por rol real**.

## 9. Adaptacion del PDF al backend actual

El PDF define un flujo ideal por roles. El backend real permite cubrir una parte, pero no toda.

| Requisito del PDF | Soporte real en backend | Impacto en frontend |
| --- | --- | --- |
| Listar eventos activos | Si | Se puede implementar ya |
| Listar destacados | Si | Se puede implementar ya |
| Listar terminados | Si | Se puede implementar ya |
| Listar cancelados | Si | Se puede implementar ya |
| Ver detalle de evento | Si | Se puede implementar ya |
| Filtrar por tipo | Si | Se puede implementar ya |
| Alta de evento con estado activo | Si | Encaja con `/eventos/alta-activo` |
| Editar evento | Si | Encaja con `/eventos/editar/{idEvento}` |
| Cancelar evento | Si | Encaja con `/eventos/cancelar/{idEvento}` |
| Mis reservas | Si, parcialmente | Se puede listar por username, pero hay que enriquecer datos en el front |
| Cancelar reserva | Si | Encaja con `DELETE /reservas/eliminar/{idReserva}` |
| Login | No | No puede implementarse de forma real aun |
| Registro con flujo de cliente | No como flujo dedicado | Solo existe `POST /usuarios/alta` |
| Control de acceso por rol | No | El frontend no puede confiar en permisos del servidor |
| JWT o sesion segura | No | No hay base real para sesion protegida |
| Maximo 10 entradas por reserva | No en servidor | Debe validarlo el frontend |
| No superar aforo | No en servidor | Debe calcularlo y bloquearlo el frontend |
| Cambio automatico a TERMINADO | No detectado | Debe resolverse en backend o como regla visual provisional |

## 10. Roles: lo que pide el reto y lo que realmente hay

### 10.1. Lo que pide el PDF

El PDF habla de:

- `ROLE_ADMON`
- `ROLE_CLIENTE`
- invitado

y de una navegacion distinta segun el rol.

### 10.2. Lo que realmente ofrece el backend

El backend tiene:

- tabla de usuarios,
- tabla de perfiles,
- tabla intermedia usuario-perfiles.

Eso significa que el dominio si esta preparado para roles a nivel conceptual.

### 10.3. Lo que falta para que el front pueda usarlo bien

Falta al menos:

- autenticacion,
- endpoint de login,
- endpoint de usuario autenticado,
- respuestas que incluyan el rol del usuario o una forma fiable de obtenerlo,
- proteccion real de endpoints.

### 10.4. Conclusion practica para el frontend

Hoy el front puede:

- mostrar pantallas publicas,
- montar paneles CRUD,
- reservar por username si ese dato ya se conoce,
- simular un usuario activo en local.

Pero hoy **no puede** ofrecer de forma segura:

- login real,
- sesion real,
- control de acceso real,
- experiencia fiable por rol solo con la API actual.

## 11. Validaciones que el frontend tendra que asumir

Como el backend actual no implementa validaciones fuertes ni reglas de reserva en servicios, el frontend debe proteger la UX con validaciones propias.

### 11.1. Validaciones obligatorias en formularios

- campos requeridos,
- formato de email,
- cantidad positiva,
- cantidad maxima por reserva,
- fechas validas,
- seleccion obligatoria de tipo,
- precio valido,
- direccion obligatoria en eventos.

### 11.2. Reglas de negocio que hoy debe controlar el frontend

- no permitir reservar mas de 10 entradas,
- no permitir reservar si el calculo de plazas libres ya esta agotado,
- no mostrar acciones de reserva en eventos cancelados o terminados,
- ocultar o bloquear acciones administrativas para invitados,
- controlar estados de carga, vacio y error.

### 11.3. Como calcular disponibilidad

El backend no ofrece un endpoint directo de "plazas libres". Para aproximarlo desde el frontend:

1. cargar el evento con `GET /eventos/{idEvento}`,
2. cargar las reservas del evento con `GET /reservas/por-evento/{idEvento}`,
3. sumar `cantidad`,
4. calcular `aforoMaximo - totalReservado`.

## 12. Estrategia de consumo API recomendada para React

### 12.1. Capa de servicios

Conviene separar llamadas por dominio:

- `eventosApi`
- `reservasApi`
- `tiposApi`
- `usuariosApi`
- `perfilesApi`
- `usuarioPerfilesApi`

### 12.2. Adaptadores de datos

Conviene crear utilidades para:

- convertir DTOs en modelos de UI,
- enriquecer reservas con nombre del evento,
- resolver el nombre del tipo a partir de `idTipo`,
- construir payloads de escritura para entidades JPA.

### 12.3. Manejo de errores esperado

Por el codigo actual, las respuestas mas habituales seran:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `404 Not Found`

No hay una estrategia avanzada detectada para:

- `401 Unauthorized`
- `403 Forbidden`
- `409 Conflict`

porque el backend no implementa seguridad ni validaciones de negocio sofisticadas.

### 12.4. CORS

No se ha encontrado configuracion `@CrossOrigin` ni configuracion global equivalente.

Implicacion:

- si el frontend se ejecuta en un origen distinto al backend, puede ser necesario configurar CORS del lado servidor antes de integrar desde el navegador.

## 13. Pantallas frontend recomendadas segun el backend actual

| Pantalla | Viabilidad actual | Endpoints principales |
| --- | --- | --- |
| Home publica | Alta | `/eventos/destacados`, `/eventos/por-estado-activo` |
| Listado de eventos activos | Alta | `/eventos/por-estado-activo` |
| Listado de destacados | Alta | `/eventos/destacados` |
| Listado de cancelados | Alta | `/eventos/cancelados` |
| Listado de terminados | Alta | `/eventos/terminados` |
| Detalle de evento | Alta | `/eventos/{idEvento}` |
| Filtros por tipo | Alta | `/tipos`, `/eventos/tipo/{idTipo}` |
| Busqueda por nombre | Alta | `/eventos/por-nombre/{palabra}` |
| Mis reservas | Media | `/reservas/por-usuario-activo/{username}` |
| Crear reserva | Media | `/reservas/alta` |
| Cancelar reserva | Alta | `/reservas/eliminar/{idReserva}` |
| Admin de eventos | Alta | CRUD de `/eventos` |
| Admin de tipos | Alta | CRUD de `/tipos` |
| Admin de perfiles | Alta | CRUD de `/perfiles` |
| Admin de usuarios | Media | CRUD de `/usuarios`, con problema de `username` ausente en DTO |
| Login real | Baja | No existe endpoint |
| Sesion por JWT | Baja | No existe soporte |
| Roles reales | Baja | Dominio existe, integracion API insuficiente |

## 14. Requisitos DWEC adaptados a este backend

El PDF sigue siendo la referencia academica, pero el trabajo del front debe construirse sobre lo que esta API si puede dar ahora mismo.

### 14.1. SPA con componentes reutilizables

Sigue siendo obligatorio y compatible con el backend actual.

Componentes razonables:

- `EventCard`
- `EventList`
- `EventFilters`
- `EventDetail`
- `ReservationForm`
- `AdminEventTable`
- `TipoSelect`
- `EstadoBadge`
- `PriceTag`

### 14.2. Formularios con validacion y gestion de errores

Aqui el frontend tiene mas responsabilidad de la habitual porque el backend no esta haciendo casi validacion funcional.

El front debe validar:

- cantidad maxima,
- aforo disponible,
- datos obligatorios,
- consistencia basica del formulario.

### 14.3. Consumo de API

Debe hacerse con una capa clara de servicios y, si es posible:

- carga diferida de vistas,
- cache de tipos,
- enriquecimiento de reservas con datos de evento,
- manejo de errores de red.

### 14.4. Gestion de sesion

El PDF la exige, pero con la API actual solo puede existir una solucion provisional. Ejemplos de enfoque provisional:

- selector local de usuario de pruebas,
- almacenamiento local de `username`,
- simulacion de "usuario activo" sin seguridad real.

Esto puede servir para demo tecnica, pero **no equivale** a autenticacion real.

### 14.5. Accesibilidad y rendimiento

Siguen siendo plenamente exigibles y no dependen del backend:

- labels,
- contraste,
- navegacion por teclado,
- foco visible,
- buena jerarquia,
- carga optimizada de vistas,
- imagenes ligeras.

## 15. Requisitos DIW adaptados al proyecto

El backend no condiciona tanto esta parte, pero si define el contenido que la UI tiene que soportar:

- listados de eventos,
- filtros,
- detalle,
- reservas,
- panel admin,
- gestion de tipos, perfiles y usuarios.

La interfaz deberia estar pensada para:

- movil,
- tablet,
- escritorio.

Y conviene documentar:

- paleta,
- tipografias,
- grid,
- componentes reutilizables,
- decisiones UX.

## 16. Entregables que siguen siendo validos para el frontend

Aunque el backend actual tenga limites, los entregables del PDF siguen siendo aplicables:

- Figma de las vistas principales
- codigo fuente del frontend en ZIP y GitHub
- capturas y evidencias
- video del flujo principal
- documentacion tecnica del frontend

## 17. Huecos tecnicos importantes detectados

Este apartado resume lo mas importante que el frontend debe tener en cuenta antes de intentar cerrar el reto completo.

1. No hay login real.
2. No hay JWT ni sesion segura.
3. No hay control de acceso real en servidor.
4. No hay CORS configurado de forma visible.
5. No hay validaciones de negocio fuertes para reservas.
6. `UsuarioDto` no devuelve `username`.
7. `UsuarioPerfilDto` no devuelve `username`.
8. `ReservaDto` no devuelve datos ricos del evento ni del usuario.
9. No se ha encontrado logica automatica para pasar eventos a `TERMINADO`.
10. No se ha encontrado script SQL en el backend para recrear la base de datos.

## 18. Conclusion general

El frontend puede apoyarse ya en un backend real para construir una buena parte del reto:

- home,
- listados,
- filtros,
- detalle,
- reservas,
- paneles CRUD,
- consultas administrativas.

Pero el documento debe dejar claro que, con el backend actual, todavia hay una diferencia importante entre:

- el **alcance academico completo** que pide el PDF,
- y el **alcance tecnico real** que hoy soporta la API.

La SPA del frontend puede avanzar mucho ya, pero para cerrar el reto exactamente como se pide aun faltan, sobre todo, autenticacion, roles funcionales, validaciones de negocio en servidor y un contrato de datos mas comodo para algunas pantallas administrativas.

## 19. Guia de puntuacion del frontend

La siguiente rubrica es la que estaba añadida en el `README.md` y se mantiene aqui para que la documentacion del front este centralizada.

| Criterio | 0.8 pts | 0.6 pts | 0.4 pts | 0 pts |
| --- | --- | --- | --- | --- |
| Desarrollo de SPA con componentes reutilizables | SPA bien estructurada, con componentes modulares y navegacion fluida. | SPA funcional con componentes reutilizables y enrutado. | SPA basica con componentes poco estructurados. | No se desarrolla SPA o presenta errores graves. |
| Formularios con validacion y gestion de errores | Formularios robustos, con validaciones avanzadas y experiencia de usuario cuidada. | Formularios completos con validaciones y gestion de errores. | Formularios funcionales con validaciones minimas. | Formularios inexistentes o sin validacion. |
| Consumo de APIs y gestion de sesion | Consumo eficiente, con control de sesion seguro y persistente. | Consumo funcional con gestion de sesion basica. | Consumo basico sin gestion de sesion. | No se consume API o presenta errores. |
| Accesibilidad y rendimiento | Interfaz optimizada, accesible y con buenas practicas de rendimiento. | Interfaz accesible y con rendimiento aceptable. | Se aplican criterios basicos sin validacion. | No se tienen en cuenta criterios de accesibilidad ni optimizacion. |
| Documentacion tecnica | Documentacion completa, profesional, con capturas, referencias y buenas practicas. | Documentacion clara, estructurada y con evidencias. | Documentacion parcial o poco clara. | Inexistente o muy deficiente. |

**Puntuacion total del bloque mostrado:** `4 puntos`
