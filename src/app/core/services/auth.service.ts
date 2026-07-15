import { Injectable, inject } from "@angular/core";
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "@angular/fire/auth";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Usuario } from "../models/usuario.model";

/**
 * Servicio encargado de la autenticación de usuarios mediante
 * Firebase Authentication (email y contraseña).
 *
 * Expone un observable con el estado del usuario autenticado
 * y métodos para iniciar sesión, registrarse y cerrar sesión.
 */
@Injectable({ providedIn: "root" })
export class AuthService {
  private auth = inject(Auth);
  /**
   * Emite el usuario autenticado actualmente, o `null` si no hay
   * sesión activa. Se actualiza automáticamente ante cualquier
   * cambio en el estado de autenticación de Firebase.
   */
  readonly usuario$: Observable<Usuario | null> = authState(this.auth).pipe(
    map((user: User | null) =>
      user ? { uid: user.uid, email: user.email } : null,
    ),
  );
  /**
   * Inicia sesión con email y contraseña.
   *
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @throws {FirebaseError} Si las credenciales son inválidas o el usuario no existe.
   */
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Crea una nueva cuenta de usuario con email y contraseña.
   *
   * @param email Correo electrónico a registrar.
   * @param password Contraseña (mínimo 6 caracteres, exigido por Firebase).
   * @throws {FirebaseError} Si el email ya está en uso o la contraseña es débil.
   */
  async registrar(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }
  /** Cierra la sesión del usuario actual. */

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
  /**
   * Devuelve el UID del usuario autenticado actualmente.
   *
   * @returns El UID del usuario, o `null` si no hay sesión activa.
   */
  get uidActual(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
