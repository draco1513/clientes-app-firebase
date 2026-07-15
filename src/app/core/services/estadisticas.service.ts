import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

export interface EstadisticasEdad {
  promedio: number;
  desviacionEstandar: number;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {

  calcularEstadisticasEdad(clientes: Cliente[]): EstadisticasEdad {
    const cantidad = clientes.length;

    if (cantidad === 0) {
      return { promedio: 0, desviacionEstandar: 0, cantidad: 0 };
    }

    const edades = clientes.map((c) => c.edad);
    const promedio = this.calcularPromedio(edades);
    const desviacionEstandar = this.calcularDesviacionEstandar(edades, promedio);

    return { promedio, desviacionEstandar, cantidad };
  }

  private calcularPromedio(valores: number[]): number {
    const suma = valores.reduce((acumulado, valor) => acumulado + valor, 0);
    return suma / valores.length;
  }

  private calcularDesviacionEstandar(valores: number[], promedio: number): number {
    const sumaDiferenciasCuadradas = valores.reduce(
      (acumulado, valor) => acumulado + Math.pow(valor - promedio, 2),
      0
    );
    const varianza = sumaDiferenciasCuadradas / valores.length;
    return Math.sqrt(varianza);
  }
}
