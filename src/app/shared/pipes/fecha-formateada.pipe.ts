import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'fechaFormateada',
    standalone: true,
})
export class FechaFormateadaPipe implements PipeTransform {

    transform(value: string | Date | number | null | undefined, formato: string = 'dd/MM/yyyy'): string {
        if (!value) {
            return '';
        }

        try {
            let fecha: Date;

            if (typeof value === 'string') {
                fecha = new Date(value);
            } else if (typeof value === 'number') {
                fecha = new Date(value);
            } else if (value instanceof Date) {
                fecha = value;
            } else {
                return '';
            }

            if (isNaN(fecha.getTime())) {
                return '';
            }

            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const año = fecha.getFullYear();

            switch (formato) {
                case 'dd/MM/yyyy':
                    return `${dia}/${mes}/${año}`;
                case 'yyyy-MM-dd':
                    return `${año}-${mes}-${dia}`;
                case 'dd de MMMM de yyyy':
                    return this.formatoCompleto(fecha);
                default:
                    return `${dia}/${mes}/${año}`;
            }
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return '';
        }
    }

    private formatoCompleto(fecha: Date): string {
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();

        return `${dia} de ${mes} de ${año}`;
    }
}
