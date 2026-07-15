import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Cliente, ClienteFormValue } from "../models/cliente.model";

/** Nombre de la colección de Firestore donde se almacenan los clientes. */

const COLECCION = "clientes";

/**
 * Servicio de acceso a datos para la entidad Cliente.
 *
 * Encapsula todas las operaciones CRUD contra Firestore, dejando
 * a los componentes libres de conocer detalles de la API de Firebase.
 */
@Injectable({ providedIn: "root" })
export class ClienteService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  obtenerClientes(): Observable<Cliente[]> {
    const clientesRef = collection(this.firestore, COLECCION);
    return collectionData(clientesRef, { idField: "id" }) as Observable<
      Cliente[]
    >;
  }

  /**
   * Obtiene un cliente puntual por su ID, en tiempo real.
   *
   * @param id ID del documento de Firestore.
   * @returns Observable que emite el cliente solicitado (o `undefined` si no existe).
   */
  obtenerClientePorId(id: string): Observable<Cliente | undefined> {
    const clienteDoc = doc(this.firestore, `${COLECCION}/${id}`);
    return docData(clienteDoc, { idField: "id" }) as Observable<
      Cliente | undefined
    >;
  }

  /**
   * Obtiene todos los clientes registrados en tiempo real.
   *
   * @returns Observable que emite la lista completa de clientes
   * cada vez que hay un cambio en la colección de Firestore.
   */
  async crearCliente(valor: ClienteFormValue): Promise<void> {
    const uid = this.authService.uidActual;
    if (!uid) {
      throw new Error(
        "No hay un usuario autenticado. No se puede crear el cliente.",
      );
    }
    /**
     * Crea un nuevo cliente asociado al usuario autenticado.
     *
     * @param valor Datos del formulario de creación de cliente.
     * @throws {Error} Si no hay un usuario autenticado.
     */
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
  /**
   * Actualiza parcialmente los datos de un cliente existente.
   *
   * @param id ID del documento de Firestore a actualizar.
   * @param valor Campos a modificar (parcial).
   */
  async actualizarCliente(
    id: string,
    valor: Partial<ClienteFormValue>,
  ): Promise<void> {
    const clienteDoc = doc(this.firestore, `${COLECCION}/${id}`);
    const cambios: Record<string, unknown> = {
      ...valor,
      updatedAt: serverTimestamp(),
    };

    if (valor.fechaNacimiento) {
      cambios["fechaNacimiento"] = Timestamp.fromDate(valor.fechaNacimiento);
    }

    await updateDoc(clienteDoc, cambios as { [key: string]: any });
  }
  /**
   * Elimina un cliente de forma permanente.
   *
   * @param id ID del documento de Firestore a eliminar.
   */
  async eliminarCliente(id: string): Promise<void> {
    const clienteDoc = doc(this.firestore, `${COLECCION}/${id}`);
    await deleteDoc(clienteDoc);
  }
}
