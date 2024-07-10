import { ProyectoService } from '../../../services/proyecto.service';
import { Proyectos } from '../../../models/proyectos';
import { Component, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EditarComponent } from './editar/editar.component';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DateFormatPipe } from '../../../../date-format.pipe';
import { Cotizaciones } from '../../../models/cotizaciones';
import { CotizacionService } from '../../../services/cotizacion.service';
import { ClienteService } from '../../../services/cliente.service';
import { Clientes } from '../../../models/clientes';
import { Empleados } from '../../../models/empleados';
import { Elementos } from '../../../models/elementos';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    MatTableModule, MatIcon, MatPaginatorModule, MatInputModule, RouterLink, RouterLinkActive, EditarComponent, NgIf, CommonModule, ReactiveFormsModule, DateFormatPipe
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent {
  visible = true;
  displayedColumns: string[] = ['Titulo', 'Descripción', 'Desarrollador', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'editar', 'pdf'];
  dataSource: any = [];
  idProyecto = signal(0);
  proyectos: Proyectos[] = [];
  cotizacion!: Cotizaciones;
  cliente!: Clientes;
  empleado!: Empleados;
  elemento!: Elementos;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private proyectoService: ProyectoService, private cotizacionService: CotizacionService, private clienteService: ClienteService, ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.proyectoService.getProyectos().subscribe((proyectos) => {
      this.proyectos = proyectos;
      this.dataSource = new MatTableDataSource(proyectos);
      this.dataSource.paginator = this.paginator;
      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setClass(Proyectos: Proyectos) {
    switch (Proyectos.estado.estado) {
      case 'En curso':
        return 'enCurso';
      case 'Pendiente':
        return 'pendiente';
      case 'Culminado':
        return 'culminado';
      default:
        return 'cancelado';
    }
  }

  setIdProyecto(clickedRows: any) {
    if (clickedRows) {
      this.idProyecto.set(clickedRows.idProyecto);
      this.visible = !this.visible;
    } else {
      console.warn('idProyecto no está definido o es inaccesible en clickedRows.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.visible = !this.visible;
  }

  async downloadPDF(proyecto: Proyectos) {
    try {
        const cliente = await this.loadClienteById(proyecto.cliente.idCliente);
        const empleado = await this.loadEmpleadoById(proyecto.empleado.idEmpleado);
        const cotizacion = await this.loadCotizacionById(proyecto.idProyecto);

        const pdfContent = document.createElement('div');
        pdfContent.style.width = '210mm'; // Ancho A4
        pdfContent.style.height = '297mm'; // Alto A4
        pdfContent.style.margin = '0 auto'; // Centrado horizontal
        pdfContent.style.padding = '20mm'; // Espacio alrededor del contenido
        pdfContent.style.boxSizing = 'border-box'; // Incluye el padding dentro del tamaño total
        pdfContent.style.fontFamily = 'Arial, sans-serif';
        pdfContent.style.color = '#333';
        pdfContent.style.backgroundColor = '#fff';

        pdfContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 24px; color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px;">Información del Proyecto</h1>
                <span><strong>Nombre del proyecto:</strong> ${proyecto.nombre_proyecto}</span>
                <span><strong>Descripción del proyecto:</strong> ${proyecto.descripcion}</span>
                <span><strong>Fecha de inicio:</strong> ${proyecto.fecha_inicio}</span>
                <span><strong>Fecha de fin:</strong> ${proyecto.fecha_fin}</span>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 5px; margin-bottom: 10px;">Información del Cliente</h2>
                <span><strong>Nombre del Cliente:</strong> ${cliente.nombre_cliente}</span>
                <span><strong>Correo del Cliente:</strong> ${cliente.correo_cliente}</span>
                <span><strong>Teléfono del Cliente:</strong> ${cliente.telefono_cliente}</span>
                <span><strong>DNI del Cliente:</strong> ${cliente.dni_cliente}</span>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 5px; margin-bottom: 10px;">Información del Desarrollador</h2>
                <span><strong>Nombre del Desarrollador:</strong> ${empleado.nombre_empleado}</span>
                <span><strong>Correo del Desarrollador:</strong> ${empleado.correo_empleado}</span>
                <span><strong>DNI del Desarrollador:</strong> ${empleado.dni_empleado}</span>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 5px; margin-bottom: 10px;">Información de la Cotización</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Fecha de la cotización</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Subtotal</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Descuento</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${cotizacion.fecha_cotizacion}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${cotizacion.subtotal}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${cotizacion.descuento}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${cotizacion.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        document.body.appendChild(pdfContent);

        html2canvas(pdfContent).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${proyecto.nombre_proyecto}.pdf`);
            document.body.removeChild(pdfContent);
        });
    } catch (error) {
        console.error('Error al obtener los datos del proyecto:', error);
    }
}

loadCotizacionById(idProyecto: number): Promise<any> {
    return new Promise((resolve, reject) => {
        this.cotizacionService.getCotizacionByID(idProyecto).subscribe({
            next: (cotizacion) => {
                this.cotizacion = cotizacion;
                console.table(cotizacion);
                resolve(cotizacion);
            },
            error: (err) => {
                console.error('Error loading client:', err);
                reject(err);
            }
        });
    });
}

loadClienteById(idCliente: number): Promise<any> {
    return new Promise((resolve, reject) => {
        this.clienteService.getClienteById(idCliente).subscribe({
            next: (cliente) => {
                this.cliente = cliente;
                console.table(cliente);
                resolve(cliente);
            },
            error: (err) => {
                console.error('Error loading client:', err);
                reject(err);
            }
        });
    });
}

loadEmpleadoById(idEmpleado: number): Promise<any> {
    return new Promise((resolve, reject) => {
        this.proyectoService.getEmpleadoById(idEmpleado).subscribe({
            next: (empleado) => {
                this.empleado = empleado;
                console.table(empleado);
                resolve(empleado);
            },
            error: (err) => {
                console.error('Error loading client:', err);
                reject(err);
            }
        });
    });
}
}