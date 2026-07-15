import { Timestamp } from "@angular/fire/firestore";
/**
 * Representa un cliente registrado en Firestore.
 */

export interface Cliente {
  /** ID del documento en Firestore. Ausente antes de persistir el registro. */
  id?: string;
  nombre: string;
  apellido: string;
  /** Edad del cliente, calculada a partir de su fecha de nacimiento. */
  edad: number;
  /** Fecha de nacimiento almacenada como Timestamp de Firestore. */
  fechaNacimiento: Timestamp;
  /** UID del usuario autenticado que registró este cliente. */
  uid: string;
  /** Marca de tiempo de creación, asignada por el servidor. */
  createdAt: Timestamp;
  /** Marca de tiempo de la última actualización, si aplica. */
  updatedAt?: Timestamp;
}

/**
 * Forma de los datos tal como los produce el formulario de creación/edición
 * de clientes, antes de ser convertidos al formato de Firestore.
 */
export interface ClienteFormValue {
  nombre: string;
  apellido: string;
  edad: number;
  fechaNacimiento: Date;
}

/**
 * Criterios de filtrado aplicables al listado de clientes.
 */
export interface ClienteFiltro {
  texto?: string;
  edadMinima?: number;
  edadMaxima?: number;
}

/** Campos por los cuales se puede ordenar el listado de clientes. */

export type ClienteOrdenCampo =
  | "nombre"
  | "apellido"
  | "edad"
  | "fechaNacimiento";
