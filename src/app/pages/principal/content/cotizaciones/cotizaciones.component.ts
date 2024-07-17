import {AfterViewInit, Component, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CotizacionService } from '../../../services/cotizacion.service';
import { MatIcon } from '@angular/material/icon';
import { Cotizaciones } from '../../../models/cotizaciones';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ElementosComponent } from './elementos/elementos.component';
import { EmailSendService } from '../../../services/email-send.service';
import { AlertComponent } from '../../mat-angular/alert/alert.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProyectoService } from '../../../services/proyecto.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [
    ElementosComponent,
    MatTableModule,
    NgFor,
    MatIcon,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    AlertComponent
  ],
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent {
  durationInSeconds = 5;
  displayedColumns: string[] = ['Proyecto', 'Descripcion', 'Servicios', 'Costos', 'SubTotal', 'Descuento', 'Total', 'acciones'];
  dataSource = new MatTableDataSource<Cotizaciones>();
  cotizaciones: Cotizaciones[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private cotizacionService: CotizacionService,
    private sendEmailServcice: EmailSendService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.loadCotizaciones();
  }

  loadCotizaciones() {
    this.cotizacionService.getCotizaciones().subscribe((cotizaciones) => {
      this.cotizaciones = cotizaciones;
      this.dataSource.data = cotizaciones;
      console.table(this.cotizaciones);
    });
  }

  createFilter(): (data: Cotizaciones, filter: string) => boolean {
    return (data: Cotizaciones, filter: string): boolean => {
      const searchString = filter.trim().toLowerCase();

      // Helper function to convert dates to strings
      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const matchProject = (data.proyecto?.nombre_proyecto?.toLowerCase().includes(searchString) ?? false) ||
                           (data.proyecto?.descripcion?.toLowerCase().includes(searchString) ?? false) ||
                           (data.proyecto?.idProyecto?.toString().includes(searchString) ?? false);

      const matchElementos = data.elementos?.some(el => el.elementos?.[0].nombre_elemento?.toLowerCase().includes(searchString) ?? false) ||
                             data.elementos?.some(el => el.elementos?.[0].costo?.toString().includes(searchString) ?? false);

      const matchFechaCotizacion = formatDate(new Date(data.fecha_cotizacion)).includes(searchString);

      return matchProject ||
             matchElementos ||
             (data.descuento?.toString().includes(searchString) ?? false) ||
             matchFechaCotizacion ||
             (data.idCotizacion?.toString().includes(searchString) ?? false) ||
             (data.subtotal?.toString().includes(searchString) ?? false) ||
             (data.total?.toString().includes(searchString) ?? false);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enviarEmail(idProyecto: number) {
    this.sendEmailServcice.sendEmail(idProyecto).subscribe((data) => {
      if (data) {
        this.openSnackBar("Correo enviado correctamente📩");
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message: message }
    });
  }
}
