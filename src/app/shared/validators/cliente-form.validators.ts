import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EDAD_MAXIMA_PERMITIDA = 120;


export function fechaNoFuturaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as Date | null;
    if (!valor) {
      return null;
    }
    return valor > new Date() ? { fechaFutura: true } : null;
  };
}

export function fechaEdadMaximaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as Date | null;
    if (!valor) {
      return null;
    }

    const limite = new Date();
    limite.setFullYear(limite.getFullYear() - EDAD_MAXIMA_PERMITIDA);

    return valor < limite ? { edadFueraDeRango: true } : null;
  };
}

export function edadCoincideConFechaValidator(
  campoFecha: string,
  campoEdad: string
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const fecha = grupo.get(campoFecha)?.value as Date | null;
    const edadIngresada = grupo.get(campoEdad)?.value as number | null;

    if (!fecha || edadIngresada === null || edadIngresada === undefined) {
      return null;
    }

    const edadCalculada = calcularEdadDesdeFecha(fecha);
    const diferenciaAceptable = Math.abs(edadCalculada - edadIngresada) <= 0;

    return diferenciaAceptable ? null : { edadInconsistente: true };
  };
}

export function calcularEdadDesdeFecha(fecha: Date): number {
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

export function soloLetrasValidator(): ValidatorFn {
  const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as string | null;
    if (!valor) {
      return null;
    }
    return patron.test(valor) ? null : { soloLetras: true };
  };
}
