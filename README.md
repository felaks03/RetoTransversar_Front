# RetoTransversar_Front

Frontend del reto transversal.

## Estado actual

Este repositorio todavia conserva una base provisional en **React + Vite**, pero la decision de implementacion ya fijada para el proyecto es **Angular**.

Eso implica que la siguiente fase de trabajo sera:

- sustituir la base actual por un proyecto Angular,
- estructurar la SPA con Angular Router,
- integrar el backend Spring Boot en `http://localhost:8095`,
- y construir formularios, filtros, reservas y paneles CRUD en Angular.

## Documentacion

La referencia funcional y tecnica del frontend esta en [`FrontDocumentation.md`](./FrontDocumentation.md).

## Nota importante

Mientras no se haga la migracion, `package.json` y los scripts actuales siguen perteneciendo al scaffold de React/Vite y **no representan la arquitectura objetivo final**.
