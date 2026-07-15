import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  readonly usuario$: Observable<Usuario | null> = authState(this.auth).pipe(
    map((user: User | null) => (user ? { uid: user.uid, email: user.email } : null))
  );


  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registrar(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  get uidActual(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}