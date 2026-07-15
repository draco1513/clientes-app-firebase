import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    Query,
    DocumentData,
    QueryConstraint,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Cliente, EstadisticasClientes } from '../models/cliente.model';


@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    private clientesSubject = new BehaviorSubject<Cliente[]>([]);
    public clientes$ = this.clientesSubject.asObservable();

    private readonly COLLECTION_NAME = 'clientes';

    constructor(private firestore: Firestore) {
        this.cargarClientes();
    }

    cargarClientes(): void {
        from(this.obtenerClientesDesdeFirestore())
            .pipe(
                tap((clientes) => this.clientesSubject.next(clientes)),
                catchError((error) => {
                    console.error('Error cargando clientes:', error);
                    throw error;
                })
            )
            .subscribe();
    }


    private async obtenerClientesDesdeFirestore(): Promise<Cliente[]> {
        const clientesRef = collection(this.firestore, this.COLLECTION_NAME);
        const snapshot = await getDocs(clientesRef);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Cliente));
    }

    getClientes(): Observable<Cliente[]> {
        return this.clientes$.asObservable();
    }


    async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<string> {
        try {
            const clientesRef = collection(this.firestore, this.COLLECTION_NAME);
            const docRef = await addDoc(clientesRef, {
                ...cliente,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            this.cargarClientes();
            return docRef.id;
        } catch (error) {
            console.error('Error creando cliente:', error);
            throw error;
        }
    }


    async actualizarCliente(id: string, cliente: Partial<Cliente>): Promise<void> {
        try {
            const clienteRef = doc(this.firestore, this.COLLECTION_NAME, id);
            await updateDoc(clienteRef, {
                ...cliente,
                updatedAt: new Date(),
            });
            this.cargarClientes();
        } catch (error) {
            console.error('Error actualizando cliente:', error);
            throw error;
        }
    }


    async eliminarCliente(id: string): Promise<void> {
        try {
            const clienteRef = doc(this.firestore, this.COLLECTION_NAME, id);
            await deleteDoc(clienteRef);
            this.cargarClientes();
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            throw error;
        }
    }


    calcularEstadisticas(): EstadisticasClientes {
        const clientes = this.clientesSubject.value;

        if (clientes.length === 0) {
            return {
                totalClientes: 0,
                promedioEdad: 0,
                desviacionEstandar: 0,
                edadMinima: 0,
                edadMaxima: 0,
            };
        }

        const edades = clientes.map((c) => c.edad);

        const promedioEdad = edades.reduce((a, b) => a + b, 0) / edades.length;

        const varianza = edades.reduce((sum, edad) => sum + Math.pow(edad - promedioEdad, 2), 0) / edades.length;
        const desviacionEstandar = Math.sqrt(varianza);

        return {
            totalClientes: clientes.length,
            promedioEdad: Math.round(promedioEdad * 100) / 100,
            desviacionEstandar: Math.round(desviacionEstandar * 100) / 100,
            edadMinima: Math.min(...edades),
            edadMaxima: Math.max(...edades),
        };
    }


    filtrarClientes(filtro: string): Cliente[] {
        const clientes = this.clientesSubject.value;
        if (!filtro) {
            return clientes;
        }

        const filterLower = filtro.toLowerCase();
        return clientes.filter(
            (c) =>
                c.nombre.toLowerCase().includes(filterLower) ||
                c.apellido.toLowerCase().includes(filterLower)
        );
    }


    ordenarClientes(
        clientes: Cliente[],
        campo: keyof Cliente,
        ascendente: boolean = true
    ): Cliente[] {
        return [...clientes].sort((a, b) => {
            let aValue = a[campo];
            let bValue = b[campo];

            if (typeof aValue === 'string') {
                aValue = (aValue as string).toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (aValue < bValue) return ascendente ? -1 : 1;
            if (aValue > bValue) return ascendente ? 1 : -1;
            return 0;
        });
    }
}
