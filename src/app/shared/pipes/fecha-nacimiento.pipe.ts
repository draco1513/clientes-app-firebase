import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';


@Pipe({
  name: 'fechaNacimiento',
  standalone: true,
})
export class FechaNacimientoPipe implements PipeTransform {
  transform(valor: Date | Timestamp | null | undefined): string {
    if (!valor) {
      return '—';
    }

    const fecha = valor instanceof Timestamp ? valor.toDate() : valor;

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
}
