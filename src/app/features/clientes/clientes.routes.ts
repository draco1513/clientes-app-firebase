import { Routes } from "@angular/router";

/**
 * Rutas hijas del feature "clientes", cargadas de forma perezosa
 * (lazy loading) desde `app.routes.ts` bajo el path `/clientes`.
 */
export const CLIENTES_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./cliente-listado/cliente-listado.component").then(
        (m) => m.ClienteListadoComponent,
      ),
  },
  {
    path: "nuevo",
    loadComponent: () =>
      import("./cliente-form/cliente-form.component").then(
        (m) => m.ClienteFormComponent,
      ),
  },
  {
    path: "editar/:id",
    loadComponent: () =>
      import("./cliente-form/cliente-form.component").then(
        (m) => m.ClienteFormComponent,
      ),
  },
];
