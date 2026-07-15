import { ValidationErrors } from '@angular/forms';


const MENSAJES_ERROR: Record<string, string> = {
  required: 'Este campo es obligatorio.',
  minlength: 'El valor ingresado es demasiado corto.',
  maxlength: 'El valor ingresado es demasiado largo.',
  min: 'El valor ingresado es menor al mínimo permitido.',
  max: 'El valor ingresado supera el máximo permitido.',
  email: 'Ingresá un email válido.',
  soloLetras: 'Solo se permiten letras y espacios.',
  fechaFutura: 'La fecha no puede ser futura.',
  edadFueraDeRango: 'La fecha implica una edad fuera de rango (0-120 años).',
  edadInconsistente: 'La edad ingresada no coincide con la fecha de nacimiento.',
};


export function obtenerMensajeError(errores: ValidationErrors | null): string | null {
  if (!errores) {
    return null;
  }

  const primeraClave = Object.keys(errores)[0];
  return MENSAJES_ERROR[primeraClave] ?? 'Valor inválido.';
}
