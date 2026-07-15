import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "./core/services/auth.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
/**
 * Componente raíz de la aplicación.
 *
 * Muestra la barra de navegación superior con el estado de sesión
 * del usuario (vía {@link AuthService.usuario$}) y expone la acción
 * de cerrar sesión.
 */
@Component({
  selector: "app-root",
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly usuario$ = this.authService.usuario$;

  async cerrarSesion(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(["/login"]);
  }
}
