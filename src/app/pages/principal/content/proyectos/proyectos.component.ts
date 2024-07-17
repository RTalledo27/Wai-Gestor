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
    MatTableModule,
    MatIcon,
    MatPaginatorModule,
    MatInputModule,
    RouterLink,
    RouterLinkActive,
    EditarComponent,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    DateFormatPipe,
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent {
  visible = true;
  displayedColumns: string[] = [
    'Titulo',
    'Descripción',
    'Desarrollador',
    'Fecha Inicio',
    'Fecha Fin',
    'Estado',
    'editar',
    'pdf',
  ];
  dataSource: any = [];
  idProyecto = signal(0);
  idCotizacion = signal(0);
  proyectos: Proyectos[] = [];
  cotizacion!: Cotizaciones;
  cliente!: Clientes;
  empleado!: Empleados;
  elemento!: Elementos;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private proyectoService: ProyectoService,
    private cotizacionService: CotizacionService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
   this.loadProyectos();
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
      this.cotizacionService.getCotizacionByID(clickedRows.idProyecto).subscribe((cotizacion) => {
        this.idCotizacion.set(cotizacion.idCotizacion);
        
      });
    } else {
      console.warn(
        'idProyecto no está definido o es inaccesible en clickedRows.'
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.visible = !this.visible;
  }

  async downloadPDF(proyecto: Proyectos) {
    try {
      const cliente = await this.loadClienteById(proyecto.cliente.idCliente);
      const empleado = await this.loadEmpleadoById(
        proyecto.empleado.idEmpleado
      );
      const cotizacion = await this.loadCotizacionById(proyecto.idProyecto);

      const pdfContent = document.createElement('div');
pdfContent.style.top = '0';
pdfContent.style.left = '0';
pdfContent.style.width = '100%';
pdfContent.style.height = 'auto';
pdfContent.style.margin = "10px";
pdfContent.style.padding = "20px";
    

      let htmlContent  = `
      <head>
      <style>
 body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .cabecera {
            background-color: #004080;
            color: #ffffff;
            padding: 10px;
            text-align: center;
        }

       .cabecera img {
    width: 100px; /* Ajusta el ancho de la imagen */
    height: auto; /* Mantiene la proporción de la imagen */
    margin: 0 auto; /* Centra la imagen horizontalmente */
    display: block; /* Asegura que la imagen se trate como un bloque para aplicar el centrado */
}
       
        p {
            line-height: 1.6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: #ffffff;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #004080;
            color: #ffffff;
        }
        tfoot th {
            background-color: #f4f4f4;
            font-size: 16px;
            color: #333; /* Asegura un color de texto oscuro */
        }
        .total {
            text-align: right;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
      </style>
       
  

      </head>
   <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
    <div class="cabecera" style="background-color: #004080; color: #ffffff; padding: 20px 0; text-align: center;"> 
        <img src="assets/img/wai-logo.svg" alt="waiLogo" > 
        <h1 style="margin: 0; font-size: 28px;">Wai Technology</h1> 
    </div>
    <h1 style="color: #004080; font-size: 28px; margin-bottom: 10px;">Detalles de la cotización #${cotizacion.idCotizacion}</h1> 
    <p style="line-height: 1.6; margin-bottom: 20px;">Estimado(a): ${cliente.nombre_cliente}</p>
    <p style="line-height: 1.6; margin-bottom: 20px;">Adjuntamos los detalles de su cotización y Proyecto:</p>

 <div class="proyecto" style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 20px;"> 
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Titulo de proyecto</h3>
        <span>${proyecto.nombre_proyecto}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Descripcion de proyecto</h3>
        <span>${proyecto.descripcion}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Fecha de inicio</h3>
        <span>${new Date(proyecto.fecha_inicio).toLocaleDateString('es', { day: 'numeric', month: '2-digit', year: 'numeric' }).split('/').join('-')}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Fecha de fin</h3>
        <span>${new Date(proyecto.fecha_fin).toLocaleDateString('es', { day: 'numeric', month: '2-digit', year: 'numeric' }).split('/').join('-')}</span>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Nombre del Desarrollador</h3>
        <span>${empleado.nombre_empleado}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">Correo del Desarrollador</h3>
        <span>${empleado.correo_empleado}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <h3 style="color: #004080; font-size: 20px; margin: 0;">DNI del Desarrollador</h3>
        <span>${empleado.dni_empleado}</span>
    </div>
</div>

    <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #ddd;">
        <thead>
            <tr>
                <th style="background-color: #004080; color: #ffffff; padding: 10px; text-align: left;">Nombre Servicio</th>
                <th style="background-color: #004080; color: #ffffff; padding: 10px; text-align: left;">Descripcion</th>
                <th style="background-color: #004080; color: #ffffff; padding: 10px; text-align: right;">Costo</th> 
                <th style="background-color: #004080; color: #ffffff; padding: 10px; text-align: right;">Descuento</th> 
            </tr>
        </thead>
        <tbody>
            ${cotizacion.elementos.map((item: any, index: number) => `
                <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};"> 
                    <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.elemento.nombre_elemento}</td>
                    <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.elemento.descripcion}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.elemento.costo}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${cotizacion.descuento}</td>
                </tr>
            `).join('')}
        </tbody>
        <tfoot>
            <tr>
                <th colspan="3" style="background-color: #f4f4f4; font-size: 16px; color: #333; padding: 10px; text-align: left;">Total:</th>
                <th style="background-color: #f4f4f4; font-size: 16px; color: #333; padding: 10px; text-align: right;">${cotizacion.total}</th>
            </tr>
        </tfoot>
    </table>
    <p style="line-height: 1.6; margin-top: 20px; font-size: 14px; color: #666;">Si tiene alguna pregunta, no dude en contactarnos.</p>
</body>
</html>

`;

                // Agregar el contenido HTML al elemento pdfContent

        pdfContent.innerHTML = htmlContent;

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
        },
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
        },
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
        },
      });
    });
  }

  loadProyectos() {
    this.proyectoService.getProyectos().subscribe((proyectos) => {
      this.proyectos = proyectos;
      this.dataSource = new MatTableDataSource(proyectos);
      this.dataSource.paginator = this.paginator;
    });
  }

  onProyectoAdded() {
    this.loadProyectos();
  }

}
