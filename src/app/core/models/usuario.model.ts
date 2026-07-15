/**
 * Representa al usuario autenticado en la aplicación.
 * Se deriva del objeto `User` de Firebase Authentication,
 * quedándonos solo con los campos que la app necesita.
 */
export interface Usuario {
  uid: string;
  email: string | null;
}
