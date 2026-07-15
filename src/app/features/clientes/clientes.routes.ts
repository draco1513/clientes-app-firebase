import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cliente-listado/cliente-listado.component').then(
        (m) => m.ClienteListadoComponent
      ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then((m) => m.ClienteFormComponent),
  },
];
