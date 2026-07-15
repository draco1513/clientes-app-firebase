import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../core/services/cliente.service';
import {
  calcularEdadDesdeFecha,
  fechaEdadMaximaValidator,
  fechaNoFuturaValidator,
  soloLetrasValidator,
} from '../../../shared/validators/cliente-form.validators';
import { obtenerMensajeError } from '../../../shared/utils/form-errors.util';


@Component({
  selector: 'app-cliente-form',
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
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  guardando = false;
  readonly fechaMaxima = new Date();

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), soloLetrasValidator()]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), soloLetrasValidator()]],
    fechaNacimiento: [null as Date | null, [Validators.required, fechaNoFuturaValidator(), fechaEdadMaximaValidator()]],
    edad: [{ value: null as number | null, disabled: true }],
  });

  obtenerMensajeError = obtenerMensajeError;

  ngOnInit(): void {
    this.form.controls.fechaNacimiento.valueChanges.subscribe((fecha) => {
      if (fecha && this.form.controls.fechaNacimiento.valid) {
        this.form.controls.edad.setValue(calcularEdadDesdeFecha(fecha));
      } else {
        this.form.controls.edad.setValue(null);
      }
    });
  }

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
      await this.clienteService.crearCliente({ nombre, apellido, edad, fechaNacimiento });
      this.snackBar.open('Cliente creado correctamente.', 'Cerrar', { duration: 3000 });
      await this.router.navigate(['/clientes']);
    } catch (error) {
      this.snackBar.open('Ocurrió un error al guardar el cliente.', 'Cerrar', { duration: 4000 });
    } finally {
      this.guardando = false;
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
