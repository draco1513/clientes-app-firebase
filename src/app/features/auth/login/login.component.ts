import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthService } from "../../../core/services/auth.service";
import { obtenerMensajeError } from "../../../shared/utils/form-errors.util";

/**
 * Componente de inicio de sesión y registro de usuarios.
 *
 * Un mismo formulario cubre ambos flujos (login/registro), alternando
 * mediante la bandera `modoRegistro` y delegando la lógica de autenticación
 * en {@link AuthService}.
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando = false;
  errorMensaje: string | null = null;
  modoRegistro = false;

  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  obtenerMensajeError = obtenerMensajeError;

  /** Cambia entre el modo de inicio de sesión y el de registro. */

  alternarModo(): void {
    this.modoRegistro = !this.modoRegistro;
    this.errorMensaje = null;
  }
  /**
   * Envía el formulario: inicia sesión o registra una cuenta nueva
   * según el modo actual, y navega a `/clientes` si tiene éxito.
   */
  async enviar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.cargando = true;
    this.errorMensaje = null;

    try {
      if (this.modoRegistro) {
        await this.authService.registrar(email, password);
      } else {
        await this.authService.login(email, password);
      }
      await this.router.navigate(["/clientes"]);
    } catch (error) {
      this.errorMensaje = this.traducirErrorFirebase(error);
    } finally {
      this.cargando = false;
    }
  }
  /**
   * Traduce los códigos de error de Firebase Authentication
   * a mensajes legibles en español para el usuario.
   *
   * @param error Error capturado, típicamente un `FirebaseError`.
   * @returns Mensaje de error en español.
   */

  private traducirErrorFirebase(error: unknown): string {
    const codigo = (error as { code?: string })?.code ?? "";

    const mensajes: Record<string, string> = {
      "auth/invalid-credential": "Email o contraseña incorrectos.",
      "auth/user-not-found": "No existe una cuenta con ese email.",
      "auth/wrong-password": "Contraseña incorrecta.",
      "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    };

    return mensajes[codigo] ?? "Ocurrió un error. Intentá de nuevo.";
  }
}
