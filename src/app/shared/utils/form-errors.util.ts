import { ValidationErrors } from "@angular/forms";

/**
 * Mapa de claves de error de validación a mensajes legibles en español.
 * Las claves corresponden a los nombres de error que devuelven tanto
 * los validators nativos de Angular (`required`, `min`, etc.) como
 * los validators personalizados del proyecto (`soloLetras`, `fechaFutura`, etc.).
 */

const MENSAJES_ERROR: Record<string, string> = {
  required: "Este campo es obligatorio.",
  minlength: "El valor ingresado es demasiado corto.",
  maxlength: "El valor ingresado es demasiado largo.",
  min: "El valor ingresado es menor al mínimo permitido.",
  max: "El valor ingresado supera el máximo permitido.",
  email: "Ingresá un email válido.",
  soloLetras: "Solo se permiten letras y espacios.",
  fechaFutura: "La fecha no puede ser futura.",
  edadFueraDeRango: "La fecha implica una edad fuera de rango (0-120 años).",
  edadInconsistente:
    "La edad ingresada no coincide con la fecha de nacimiento.",
};
/**
 * Traduce el objeto `ValidationErrors` de un control de Angular
 * al primer mensaje de error legible correspondiente, para
 * mostrarlo directamente en un `<mat-error>`.
 *
 * @param errores Errores de validación del control (o `null` si es válido).
 * @returns El mensaje de error en español, o `null` si no hay errores.
 */

export function obtenerMensajeError(
  errores: ValidationErrors | null,
): string | null {
  if (!errores) {
    return null;
  }

  const primeraClave = Object.keys(errores)[0];
  return MENSAJES_ERROR[primeraClave] ?? "Valor inválido.";
}
