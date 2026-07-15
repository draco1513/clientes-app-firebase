import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
/** Edad máxima considerada razonable para un cliente. */

const EDAD_MAXIMA_PERMITIDA = 120;

/**
 * Validador que rechaza fechas futuras.
 *
 * @returns Un `ValidatorFn` que devuelve `{ fechaFutura: true }`
 * si la fecha del control es posterior a hoy.
 */
export function fechaNoFuturaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as Date | null;
    if (!valor) {
      return null;
    }
    return valor > new Date() ? { fechaFutura: true } : null;
  };
}
/**
 * Validador que rechaza fechas de nacimiento que implicarían
 * una edad mayor a {@link EDAD_MAXIMA_PERMITIDA} años.
 *
 * @returns Un `ValidatorFn` que devuelve `{ edadFueraDeRango: true }`
 * si la fecha es anterior al límite permitido.
 */

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
/**
 * Validador de grupo que verifica que la edad ingresada manualmente
 * coincida con la edad calculada a partir de la fecha de nacimiento.
 *
 * @param campoFecha Nombre del control de fecha de nacimiento dentro del grupo.
 * @param campoEdad Nombre del control de edad dentro del grupo.
 * @returns Un `ValidatorFn` de grupo que devuelve `{ edadInconsistente: true }`
 * si ambos valores no coinciden.
 */
export function edadCoincideConFechaValidator(
  campoFecha: string,
  campoEdad: string,
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
/**
 * Calcula la edad en años cumplidos a partir de una fecha de nacimiento.
 *
 * @param fecha Fecha de nacimiento.
 * @returns Edad en años cumplidos a la fecha actual.
 */
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
/**
 * Validador que exige que el valor contenga únicamente letras,
 * espacios, apóstrofes y guiones (soporta acentos y ñ).
 * Usado en los campos de nombre y apellido.
 *
 * @returns Un `ValidatorFn` que devuelve `{ soloLetras: true }`
 * si el valor contiene caracteres no permitidos.
 */
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
