import { Pipe, PipeTransform } from "@angular/core";

/**
 * Pipe genérico de formateo de fechas, con soporte para
 * distintos formatos de salida (`dd/MM/yyyy`, `yyyy-MM-dd`,
 * o formato largo en español).
 *
 * @example
 * ```html
 * {{ fecha | fechaFormateada }}
 * <!-- "05/03/1990" -->
 *
 * {{ fecha | fechaFormateada:'dd de MMMM de yyyy' }}
 * <!-- "5 de marzo de 1990" -->
 * ```
 */
@Pipe({
  name: "fechaFormateada",
  standalone: true,
})
export class FechaFormateadaPipe implements PipeTransform {
  /**
   * @param value Fecha a formatear: string, número (timestamp), Date, o vacío.
   * @param formato Formato de salida deseado. Por defecto `'dd/MM/yyyy'`.
   * @returns La fecha formateada, o cadena vacía si el valor es inválido.
   */

  transform(
    value: string | Date | number | null | undefined,
    formato: string = "dd/MM/yyyy",
  ): string {
    if (!value) {
      return "";
    }

    try {
      let fecha: Date;

      if (typeof value === "string") {
        fecha = new Date(value);
      } else if (typeof value === "number") {
        fecha = new Date(value);
      } else if (value instanceof Date) {
        fecha = value;
      } else {
        return "";
      }

      if (isNaN(fecha.getTime())) {
        return "";
      }

      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();

      switch (formato) {
        case "dd/MM/yyyy":
          return `${dia}/${mes}/${año}`;
        case "yyyy-MM-dd":
          return `${año}-${mes}-${dia}`;
        case "dd de MMMM de yyyy":
          return this.formatoCompleto(fecha);
        default:
          return `${dia}/${mes}/${año}`;
      }
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "";
    }
  }

  /**
   * Formatea una fecha en formato largo en español, por ejemplo
   * "5 de marzo de 1990".
   *
   * @param fecha Fecha a formatear.
   * @returns La fecha en formato largo.
   */

  private formatoCompleto(fecha: Date): string {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
  }
}
