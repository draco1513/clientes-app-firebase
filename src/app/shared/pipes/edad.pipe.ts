import { Pipe, PipeTransform } from "@angular/core";
import { Timestamp } from "@angular/fire/firestore";
/**
 * Pipe que calcula la edad actual (en años) a partir de una fecha
 * de nacimiento, ya sea un `Date` nativo o un `Timestamp` de Firestore.
 *
 * @example
 * ```html
 * {{ cliente.fechaNacimiento | edad }} años
 * ```
 */

@Pipe({
  name: "edad",
  standalone: true,
})
export class EdadPipe implements PipeTransform {
  /**
   * @param fechaNacimiento Fecha de nacimiento (Timestamp, Date o vacío).
   * @returns La edad en años cumplidos, o `null` si no hay fecha.
   */

  transform(
    fechaNacimiento: Date | Timestamp | null | undefined,
  ): number | null {
    if (!fechaNacimiento) {
      return null;
    }

    const fecha =
      fechaNacimiento instanceof Timestamp
        ? fechaNacimiento.toDate()
        : fechaNacimiento;
    const hoy = new Date();

    let edad = hoy.getFullYear() - fecha.getFullYear();
    const noCumplioAnioAun =
      hoy.getMonth() < fecha.getMonth() ||
      (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());

    if (noCumplioAnioAun) {
      edad--;
    }

    return edad;
  }
}
