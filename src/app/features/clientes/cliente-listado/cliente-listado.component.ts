import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClienteService } from "../../../core/services/cliente.service";
import { EstadisticasService } from "../../../core/services/estadisticas.service";
import { Cliente } from "../../../core/models/cliente.model";
import { FechaNacimientoPipe } from "../../../shared/pipes/fecha-nacimiento.pipe";
import { EdadPipe } from "../../../shared/pipes/edad.pipe";
import { ClienteEstadisticasComponent } from "../cliente-estadisticas/cliente-estadisticas.component";
/**
 * Listado principal de clientes.
 *
 * Muestra la tabla de clientes registrados con soporte de:
 * - Filtrado por texto (nombre/apellido) y rango de edad.
 * - Ordenamiento por columna (`MatSort`).
 * - Estadísticas de edad (promedio y desviación estándar) vía
 *   {@link ClienteEstadisticasComponent}.
 *
 * Los datos se obtienen en tiempo real de Firestore a través de
 * {@link ClienteService.obtenerClientes}; el filtrado se aplica
 * localmente sobre la copia en memoria (`clientesOriginal`).
 */
@Component({
  selector: "app-cliente-listado",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FechaNacimientoPipe,
    ClienteEstadisticasComponent,
  ],
  templateUrl: "./cliente-listado.component.html",
  styleUrls: ["./cliente-listado.component.scss"],
})
export class ClienteListadoComponent implements OnInit, AfterViewInit {
  private clienteService = inject(ClienteService);
  private estadisticasService = inject(EstadisticasService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;

  readonly columnas = [
    "nombre",
    "apellido",
    "edad",
    "fechaNacimiento",
    "acciones",
  ];
  readonly dataSource = new MatTableDataSource<Cliente>([]);

  private clientesOriginal: Cliente[] = [];

  /** Formulario reactivo con los criterios de filtrado. */

  readonly filtroForm = this.fb.nonNullable.group({
    texto: "",
    edadMinima: null as number | null,
    edadMaxima: null as number | null,
  });

  get estadisticas() {
    return this.estadisticasService.calcularEstadisticasEdad(
      this.clientesOriginal,
    );
  }

  /**
   * Se suscribe a los clientes en tiempo real y a los cambios
   * del formulario de filtros, reaplicando el filtro en cada emisión.
   */

  ngOnInit(): void {
    this.clienteService.obtenerClientes().subscribe((clientes) => {
      this.clientesOriginal = clientes;
      this.aplicarFiltro();
    });

    this.filtroForm.valueChanges.subscribe(() => this.aplicarFiltro());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  /**
   * Aplica los criterios actuales del formulario de filtros
   * (texto, edad mínima, edad máxima) sobre `clientesOriginal`
   * y actualiza `dataSource.data` con el resultado.
   */
  private aplicarFiltro(): void {
    const { texto, edadMinima, edadMaxima } = this.filtroForm.getRawValue();
    const textoNormalizado = (texto ?? "").trim().toLowerCase();

    const filtrados = this.clientesOriginal.filter((cliente) => {
      const coincideTexto =
        !textoNormalizado ||
        cliente.nombre.toLowerCase().includes(textoNormalizado) ||
        cliente.apellido.toLowerCase().includes(textoNormalizado);

      const coincideEdadMinima =
        edadMinima === null ||
        edadMinima === undefined ||
        cliente.edad >= edadMinima;
      const coincideEdadMaxima =
        edadMaxima === null ||
        edadMaxima === undefined ||
        cliente.edad <= edadMaxima;

      return coincideTexto && coincideEdadMinima && coincideEdadMaxima;
    });

    this.dataSource.data = filtrados;
  }
  /** Restablece el formulario de filtros a sus valores por defecto. */

  limpiarFiltros(): void {
    this.filtroForm.reset({ texto: "", edadMinima: null, edadMaxima: null });
  }
  /**
   * Elimina un cliente de Firestore, previa confirmación implícita
   * del usuario (botón de eliminar en la tabla).
   *
   * @param cliente Cliente a eliminar. Si no tiene `id`, no hace nada.
   */
  async eliminar(cliente: Cliente): Promise<void> {
    if (!cliente.id) {
      return;
    }
    try {
      await this.clienteService.eliminarCliente(cliente.id);
      this.snackBar.open("Cliente eliminado.", "Cerrar", { duration: 3000 });
    } catch (error) {
      this.snackBar.open("No se pudo eliminar el cliente.", "Cerrar", {
        duration: 4000,
      });
    }
  }
}
