import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Proyectos } from '../../../../models/proyectos';

@Component({
  selector: 'app-pdf-generate',
  standalone: true,
  imports: [],
  template: ` <ng-template #pdfTemplate let-datosCotizacion="datosCotizacion">
  <div id="pdfContent" class="container-pdf">
    <div class="header-pdf">
      <img src="../../../assets/img/logo.png" alt="Logo" class="logo-pdf">
      <h1 class="title">Cotización</h1>
      <p class="date">Fecha: {{ datosCotizacion.cotizacion_seccion.fecha_cotizacion }}</p>
    </div>

    <section class="project-info">
      <h2>Información del Proyecto</h2>
      <div class="info-row">
        <span class="label">Nombre:</span>
        <span class="value">{{ datosCotizacion.proyecto_seccion.nombre_proyecto }}</span>
      </div>
      <div class="info-row">
        <span class="label">Descripción:</span>
        <span class="value">{{ datosCotizacion.proyecto_seccion.descripcion }}</span>
      </div>
      <div class="info-row">
        <span class="label">Fecha de Inicio:</span>
        <span class="value">{{ datosCotizacion.proyecto_seccion.fecha_inicio }}</span>
      </div>
      <div class="info-row">
        <span class="label">Fecha de Fin:</span>
        <span class="value">{{ datosCotizacion.proyecto_seccion.fecha_fin }}</span>
      </div>
    </section>

    <section class="client-info">
      <h2>Información del Cliente</h2>
      <div class="info-row">
        <span class="label">Nombre:</span>
        <span class="value">{{ datosCotizacion.cliente_seccion.nombre_cliente }}</span>
      </div>
      <div class="info-row">
        <span class="label">Correo:</span>
        <span class="value">{{ datosCotizacion.cliente_seccion.correo_cliente }}</span>
      </div>
      <div class="info-row">
        <span class="label">Teléfono:</span>
        <span class="value">{{ datosCotizacion.cliente_seccion.telefono_cliente }}</span>
      </div>
      <div class="info-row">
        <span class="label">DNI:</span>
        <span class="value">{{ datosCotizacion.cliente_seccion.dni_cliente }}</span>
      </div>
    </section>

    <section class="developer-info">
      <h2>Información del Desarrollador</h2>
      <div class="info-row">
        <span class="label">Nombre:</span>
        <span class="value">{{ datosCotizacion.desarrollador_seccion.nombre_desarrollador }}</span>
      </div>
      <div class="info-row">
        <span class="label">Correo:</span>
        <span class="value">{{ datosCotizacion.desarrollador_seccion.correo_desarrollador }}</span>
      </div>
      <div class="info-row">
        <span class="label">DNI:</span>
        <span class="value">{{ datosCotizacion.desarrollador_seccion.dni_desarrollador }}</span>
      </div>
    </section>

    <section class="quote-info">
      <h2>Información de la Cotización</h2>
      <table>
        <thead>
          <tr>
            <th>Elemento</th>
            <th>Costo (S/.)</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let elemento of datosCotizacion.selectedElementos">
            <td>{{ elemento.nombre_elemento }}</td>
            <td>{{ elemento.costo }}</td>
          </tr>
        </tbody>
      </table>
      <div class="totals">
        <div class="info-row">
          <span class="label">Subtotal:</span>
          <span class="value">{{ datosCotizacion.cotizacion_seccion.subtotal }}</span>
        </div>
        <div class="info-row">
          <span class="label">Descuento:</span>
          <span class="value">{{ datosCotizacion.cotizacion_seccion.descuento }}</span>
        </div>
        <div class="info-row total">
          <span class="label">Total:</span>
          <span class="value">{{ datosCotizacion.cotizacion_seccion.total }}</span>
        </div>
      </div>
    </section>
  </div>
</ng-template>`,
  styleUrl: './pdf-generate.component.css'
})
export class PdfGenerateComponent {

  @Input() proyecto!: Proyectos;
  @ViewChild('pdfTemplate') pdfTemplate!: TemplateRef<any>;



}
