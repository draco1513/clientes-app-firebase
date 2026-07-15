import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Cliente, ClienteFormValue } from '../models/cliente.model';

const COLECCION = 'clientes';


@Injectable({ providedIn: 'root' })
export class ClienteService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);


  obtenerClientes(): Observable<Cliente[]> {
    const clientesRef = collection(this.firestore, COLECCION);
    return collectionData(clientesRef, { idField: 'id' }) as Observable<Cliente[]>;
  }


  async crearCliente(valor: ClienteFormValue): Promise<void> {
    const uid = this.authService.uidActual;
    if (!uid) {
      throw new Error('No hay un usuario autenticado. No se puede crear el cliente.');
    }

    const clientesRef = collection(this.firestore, COLECCION);
    await addDoc(clientesRef, {
      nombre: valor.nombre.trim(),
      apellido: valor.apellido.trim(),
      edad: valor.edad,
      fechaNacimiento: Timestamp.fromDate(valor.fechaNacimiento),
      uid,
      createdAt: serverTimestamp(),
    });
  }

  async actualizarCliente(id: string, valor: Partial<ClienteFormValue>): Promise<void> {
    const clienteDoc = doc(this.firestore, `${COLECCION}/${id}`);
    const cambios: Record<string, unknown> = { ...valor, updatedAt: serverTimestamp() };

    if (valor.fechaNacimiento) {
      cambios['fechaNacimiento'] = Timestamp.fromDate(valor.fechaNacimiento);
    }

    await updateDoc(clienteDoc, cambios as { [key: string]: any });
  }

  async eliminarCliente(id: string): Promise<void> {
    const clienteDoc = doc(this.firestore, `${COLECCION}/${id}`);
    await deleteDoc(clienteDoc);
  }
}
