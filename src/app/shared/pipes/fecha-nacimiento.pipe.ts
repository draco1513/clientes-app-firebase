import { Pipe, PipeTransform } from "@angular/core";
import { Timestamp } from "@angular/fire/firestore";
/**
 * Pipe personalizado que formatea una fecha de nacimiento
 * (proveniente de Firestore como Timestamp, o como Date)
 * al formato local `dd/MM/yyyy`. Utilizado en el listado de clientes.
 *
 * @example
 * ```html
 * {{ cliente.fechaNacimiento | fechaNacimiento }}
 * <!-- "05/03/1990" -->
 * ```
 */
@Pipe({
  name: "fechaNacimiento",
  standalone: true,
})
export class FechaNacimientoPipe implements PipeTransform {
  /**
   * @param valor Fecha a formatear (Timestamp de Firestore, Date, o vacío).
   * @returns La fecha formateada como `dd/MM/yyyy`, o `'—'` si no hay valor.
   */
  transform(valor: Date | Timestamp | null | undefined): string {
    if (!valor) {
      return "—";
    }

    const fecha = valor instanceof Timestamp ? valor.toDate() : valor;

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
}
