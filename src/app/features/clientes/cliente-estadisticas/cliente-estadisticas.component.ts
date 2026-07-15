import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { EstadisticasEdad } from "../../../core/services/estadisticas.service";

/**
 * Componente de presentación puro que muestra las estadísticas
 * de edad de los clientes (cantidad, promedio y desviación estándar)
 * en formato de tarjetas.
 *
 * No calcula nada por sí mismo: recibe los datos ya calculados
 * vía `@Input`, siguiendo el patrón de componente "tonto"/presentacional.
 */
@Component({
  selector: "app-cliente-estadisticas",
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./cliente-estadisticas.component.html",
  styleUrls: ["./cliente-estadisticas.component.scss"],
})
export class ClienteEstadisticasComponent {
  @Input() estadisticas: EstadisticasEdad = {
    promedio: 0,
    desviacionEstandar: 0,
    cantidad: 0,
  };
}
