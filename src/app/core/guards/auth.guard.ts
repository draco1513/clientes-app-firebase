import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
/**
 * Guard de ruta que protege las secciones sensibles de la aplicación
 * (por ejemplo, el módulo de clientes) exigiendo un usuario autenticado.
 *
 * Si no hay sesión activa, redirige al usuario a `/login` en lugar
 * de permitirle acceder a la ruta solicitada.
 *
 * @example
 * ```ts
 * { path: 'clientes', canActivate: [authGuard], ... }
 * ```
 */

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario$.pipe(
    take(1),
    map((usuario) => {
      if (usuario) {
        return true;
      }
      return router.createUrlTree(["/login"]);
    }),
  );
};
