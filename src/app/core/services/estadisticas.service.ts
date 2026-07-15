import { Injectable } from "@angular/core";
import { Cliente } from "../models/cliente.model";
/** Resultado del cálculo estadístico sobre las edades de los clientes. */

export interface EstadisticasEdad {
  /** Promedio aritmético de las edades. */
  promedio: number;
  /** Desviación estándar poblacional de las edades. */
  desviacionEstandar: number;
  /** Cantidad total de clientes considerados en el cálculo. */
  cantidad: number;
}
/**
 * Servicio encargado de calcular estadísticas descriptivas
 * sobre la colección de clientes (promedio y desviación estándar de edad).
 */
@Injectable({ providedIn: "root" })
export class EstadisticasService {
  /**
   * Calcula el promedio y la desviación estándar de las edades
   * de una lista de clientes.
   *
   * @param clientes Lista de clientes sobre la cual calcular las estadísticas.
   * @returns Objeto con promedio, desviación estándar y cantidad de clientes.
   * Si la lista está vacía, devuelve todos los valores en cero.
   */
  calcularEstadisticasEdad(clientes: Cliente[]): EstadisticasEdad {
    const cantidad = clientes.length;

    if (cantidad === 0) {
      return { promedio: 0, desviacionEstandar: 0, cantidad: 0 };
    }

    const edades = clientes.map((c) => c.edad);
    const promedio = this.calcularPromedio(edades);
    const desviacionEstandar = this.calcularDesviacionEstandar(
      edades,
      promedio,
    );

    return { promedio, desviacionEstandar, cantidad };
  }

  /**
   * Calcula la desviación estándar poblacional de un conjunto de valores.
   *
   * @param valores Lista de números.
   * @param promedio Promedio previamente calculado de esos valores.
   * @returns La desviación estándar poblacional.
   */

  private calcularPromedio(valores: number[]): number {
    const suma = valores.reduce((acumulado, valor) => acumulado + valor, 0);
    return suma / valores.length;
  }

  private calcularDesviacionEstandar(
    valores: number[],
    promedio: number,
  ): number {
    const sumaDiferenciasCuadradas = valores.reduce(
      (acumulado, valor) => acumulado + Math.pow(valor - promedio, 2),
      0,
    );
    const varianza = sumaDiferenciasCuadradas / valores.length;
    return Math.sqrt(varianza);
  }
}
