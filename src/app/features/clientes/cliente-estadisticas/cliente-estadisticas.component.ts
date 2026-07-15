import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EstadisticasEdad } from '../../../core/services/estadisticas.service';


@Component({
  selector: 'app-cliente-estadisticas',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './cliente-estadisticas.component.html',
  styleUrls: ['./cliente-estadisticas.component.scss'],
})
export class ClienteEstadisticasComponent {
  @Input() estadisticas: EstadisticasEdad = { promedio: 0, desviacionEstandar: 0, cantidad: 0 };
}
