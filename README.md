# clientes-app-firebase — Angular 15 + Firebase

Aplicación web para el registro, listado, filtrado, ordenamiento y análisis
estadístico de clientes, desarrollada como desafío técnico Frontend Developer.

## 🔗 Demo en vivo

**[https://clientes-app-firebase-5cf13.firebaseapp.com](https://clientes-app-firebase-5cf13.firebaseapp.com)**

## Stack

- **Angular 15** (Standalone Components, sin NgModules)
- **Firebase**: Firestore (persistencia), Authentication (email/password), Hosting
- **Angular Material** para la UI
- **TypeScript strict mode**

## Arquitectura

El proyecto sigue una organización **feature-based** con separación en tres capas:


```
src/app/
├── core/        # Singletons: servicios de Firebase, guards, modelos
├── shared/       # Pipes, validadores y utilidades reutilizables
└── features/     # Funcionalidades de negocio (auth, clientes)
```


- `core/services/cliente.service.ts`: único punto de acceso a Firestore para la
  colección `clientes`. Los componentes nunca llaman a Firestore directamente.
- `core/services/estadisticas.service.ts`: lógica pura (promedio y desviación
  estándar), sin dependencias de Firebase, fácilmente testeable.
- `core/services/auth.service.ts`: encapsula Firebase Authentication
  (login, registro, logout, estado del usuario en tiempo real).
- `core/guards/auth.guard.ts`: guard funcional (`CanActivateFn`) que protege
  la ruta `/clientes`.
- `shared/pipes/fecha-nacimiento.pipe.ts` y `edad.pipe.ts`: pipes personalizados
  para formateo de fecha y cálculo de edad.
- `shared/validators/cliente-form.validators.ts`: validadores custom (fecha no
  futura, rango de edad válido, coincidencia edad/fecha).

## Requisitos previos

- Node.js 18+
- Angular CLI 15 (`npm install -g @angular/cli@15`)
- Una cuenta de Firebase con un proyecto creado

## Configuración de Firebase

### 1. Firestore

En Firebase Console → Firestore Database → crear base en **modo producción**.

Desplegar las reglas incluidas en `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Estas reglas exigen que el usuario esté autenticado para leer y escribir en la
colección `clientes`.

### 2. Authentication

En Firebase Console → Authentication → Sign-in method → habilitar
**Email/Password**.

### 3. Credenciales del SDK

En Firebase Console → Configuración del proyecto → SDK setup and
configuration, copiar el objeto de configuración del proyecto.

Este proyecto **no versiona** `environment.ts` ni `environment.prod.ts`
(quedan excluidos vía `.gitignore` porque contienen las credenciales del
proyecto de Firebase). Para levantar el proyecto localmente, creá ambos
archivos dentro de `src/environments/` con esta estructura:

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

**`src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

> La configuración del SDK de Firebase (apiKey, authDomain, etc.) no es un
> secreto sensible por sí sola — queda expuesta en cualquier app cliente de
> Firebase. Se excluye del repositorio por prolijidad, para no atar el
> código fuente a un proyecto de Firebase específico.

### 4. Alias del proyecto

Editar `.firebaserc` y reemplazar el `projectId` por el ID real del proyecto
de Firebase que vayas a usar.

## Instalación y desarrollo local

```bash
npm install
npm start
```

La app queda disponible en `http://localhost:4200`.

## Build y deploy

```bash
npx ng build --configuration production
firebase deploy --only hosting
```

> Si tenés instalada globalmente una versión de Angular CLI distinta a la 15,
> usá siempre `npx ng` en lugar de `ng` para asegurarte de correr la versión
> del proyecto (`package.json`) y no la global.

## Funcionalidades implementadas

- **Autenticación**: login y registro con Firebase Authentication; rutas
  protegidas con guard funcional.
- **Alta de clientes**: formulario reactivo con validaciones avanzadas
  (nombre/apellido solo letras, fecha no futura, edad en rango 0-120). El
  campo edad se **autocalcula** a partir de la fecha de nacimiento para
  evitar inconsistencias de datos.
- **Edición de clientes**: mismo formulario de alta, reutilizado en modo
  edición (`/clientes/editar/:id`), con precarga de datos existentes.
- **Listado**: tabla con Angular Material (`MatTable`), filtro por texto
  (nombre/apellido) y por rango de edad, ordenamiento por columna (`MatSort`).
- **Estadísticas**: promedio y desviación estándar poblacional de las edades,
  recalculadas en tiempo real ante cualquier alta, edición o baja de clientes.
- **Pipes personalizados**: formateo de fecha (`fechaNacimiento`) y cálculo de
  edad (`edad`).

## Notas de diseño

- Se usó desviación estándar **poblacional** (no muestral), asumiendo que el
  listado de clientes representa a toda la población de interés.
- El filtrado y ordenamiento del listado se resuelven en el cliente (no con
  queries de Firestore) para permitir combinaciones dinámicas de filtros sin
  necesidad de crear índices compuestos adicionales.
- Las reglas de Firestore exigen autenticación tanto para lectura como para
  escritura, de modo que la integridad y protección de los datos no dependa
  únicamente de la UI.

## Licencia

Proyecto desarrollado como desafío técnico. Sin licencia específica asignada.
