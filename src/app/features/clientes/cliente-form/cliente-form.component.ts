import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { ClienteService } from "../../../core/services/cliente.service";
import {
  calcularEdadDesdeFecha,
  fechaEdadMaximaValidator,
  fechaNoFuturaValidator,
  soloLetrasValidator,
} from "../../../shared/validators/cliente-form.validators";
import { obtenerMensajeError } from "../../../shared/utils/form-errors.util";

/**
 * Formulario de creación y edición de clientes.
 *
 * El mismo formulario cubre ambos flujos: si la ruta trae un `id`
 * (`/clientes/editar/:id`), el componente entra en modo edición,
 * precarga los datos del cliente existente y actualiza en lugar
 * de crear un registro nuevo.
 *
 * La edad se calcula automáticamente y en solo lectura a partir
 * de la fecha de nacimiento seleccionada, evitando inconsistencias
 * entre ambos campos.
 */

@Component({
  selector: "app-cliente-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./cliente-form.component.html",
  styleUrls: ["./cliente-form.component.scss"],
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  guardando = false;
  readonly fechaMaxima = new Date();

  /** ID del cliente en edición. `null` si el formulario está en modo creación. */
  private clienteId: string | null = null;

  /** `true` si el formulario está editando un cliente existente. */
  get modoEdicion(): boolean {
    return this.clienteId !== null;
  }

  readonly form = this.fb.nonNullable.group({
    nombre: [
      "",
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        soloLetrasValidator(),
      ],
    ],
    apellido: [
      "",
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        soloLetrasValidator(),
      ],
    ],
    fechaNacimiento: [
      null as Date | null,
      [
        Validators.required,
        fechaNoFuturaValidator(),
        fechaEdadMaximaValidator(),
      ],
    ],
    edad: [{ value: null as number | null, disabled: true }],
  });

  obtenerMensajeError = obtenerMensajeError;

  /**
   * Detecta si hay un `id` en la ruta (modo edición) y, en ese caso,
   * precarga los datos del cliente. También suscribe el campo `edad`
   * (deshabilitado) a los cambios de `fechaNacimiento`.
   */
  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get("id");

    if (this.clienteId) {
      this.clienteService
        .obtenerClientePorId(this.clienteId)
        .pipe(take(1))
        .subscribe((cliente) => {
          if (!cliente) {
            this.snackBar.open("El cliente no existe.", "Cerrar", {
              duration: 4000,
            });
            this.router.navigate(["/clientes"]);
            return;
          }

          this.form.patchValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            fechaNacimiento: cliente.fechaNacimiento.toDate(),
            edad: cliente.edad,
          });
        });
    }

    this.form.controls.fechaNacimiento.valueChanges.subscribe((fecha) => {
      if (fecha && this.form.controls.fechaNacimiento.valid) {
        this.form.controls.edad.setValue(calcularEdadDesdeFecha(fecha));
      } else {
        this.form.controls.edad.setValue(null);
      }
    });
  }

  /**
   * Valida y envía el formulario: crea un cliente nuevo o actualiza
   * el existente según `modoEdicion`. Si tiene éxito, navega de
   * vuelta al listado de clientes.
   */
  async enviar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, apellido, fechaNacimiento } = this.form.getRawValue();
    const edad = this.form.controls.edad.value;

    if (!fechaNacimiento || edad === null) {
      return;
    }

    this.guardando = true;
    try {
      if (this.modoEdicion && this.clienteId) {
        await this.clienteService.actualizarCliente(this.clienteId, {
          nombre,
          apellido,
          edad,
          fechaNacimiento,
        });
        this.snackBar.open("Cliente actualizado correctamente.", "Cerrar", {
          duration: 3000,
        });
      } else {
        await this.clienteService.crearCliente({
          nombre,
          apellido,
          edad,
          fechaNacimiento,
        });
        this.snackBar.open("Cliente creado correctamente.", "Cerrar", {
          duration: 3000,
        });
      }
      await this.router.navigate(["/clientes"]);
    } catch (error) {
      this.snackBar.open("Ocurrió un error al guardar el cliente.", "Cerrar", {
        duration: 4000,
      });
    } finally {
      this.guardando = false;
    }
  }

  /** Cancela la operación y vuelve al listado sin guardar cambios. */
  cancelar(): void {
    this.router.navigate(["/clientes"]);
  }
}
