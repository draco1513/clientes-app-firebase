import { Timestamp } from '@angular/fire/firestore';


export interface Cliente {
  id?: string;
  nombre: string;
  apellido: string;
  edad: number;
  fechaNacimiento: Timestamp;
  uid: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface ClienteFormValue {
  nombre: string;
  apellido: string;
  edad: number;
  fechaNacimiento: Date;
}

export interface ClienteFiltro {
  texto?: string;
  edadMinima?: number;
  edadMaxima?: number;
}

export type ClienteOrdenCampo = 'nombre' | 'apellido' | 'edad' | 'fechaNacimiento';
