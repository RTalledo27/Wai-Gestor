import {AfterViewInit, Component, signal, SimpleChanges, ViewChild} from '@angular/core';
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
  imports: [ElementosComponent,MatTableModule,NgFor, MatIcon,MatPaginatorModule,MatInputModule,MatFormFieldModule,MatSortModule,CommonModule,MatFormFieldModule, MatInputModule,AlertComponent ],
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.css'
})
export class CotizacionesComponent {
  durationInSeconds = 5;

 
  displayedColumns: string[] = ['Proyecto', 'Descripcion', 'Servicios','Costos', 'SubTotal','Descuento','Total','acciones'];
  dataSource: any = [];
  cotizaciones: Cotizaciones[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private cotizacionService: CotizacionService, private sendEmailServcice: EmailSendService,private _snackBar: MatSnackBar,) {}


  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataSource.paginator = this.paginator;

   

      /*this.cotizaciones = cotizaciones;
      for (let index = 0; index < cotizaciones.length; index++) {
        this.dataSource = new MatTableDataSource(cotizaciones);
        this.dataSource.paginator = this.paginator;
        console.table(this.dataSource);
      
        }*/
        this.loadCotizaciones();

  }

  loadCotizaciones() {
    this.cotizacionService.getCotizaciones()
    .subscribe((cotizaciones) => {
      this.cotizaciones = cotizaciones;
      this.dataSource = new MatTableDataSource(cotizaciones);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


  }


  enviarEmail(idProyecto: number){
   this.sendEmailServcice.sendEmail(idProyecto).subscribe((data) => {
     if(data){
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


