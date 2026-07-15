import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';


@Pipe({
  name: 'edad',
  standalone: true,
})
export class EdadPipe implements PipeTransform {
  transform(fechaNacimiento: Date | Timestamp | null | undefined): number | null {
    if (!fechaNacimiento) {
      return null;
    }

    const fecha = fechaNacimiento instanceof Timestamp ? fechaNacimiento.toDate() : fechaNacimiento;
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
