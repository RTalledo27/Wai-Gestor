import { ProyectoService } from '../../../services/proyecto.service';
import { Proyectos } from '../../../models/proyectos';
import {AfterViewInit, Component, EventEmitter, Input,  signal,  SimpleChanges,  ViewChild,} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { EditarComponent } from './editar/editar.component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DateFormatPipe } from '../../../../date-format.pipe';





@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [MatTableModule, MatIcon,MatPaginatorModule,MatInputModule,RouterLink,RouterLinkActive,EditarComponent,NgIf,CommonModule,ReactiveFormsModule,DateFormatPipe],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})

export class ProyectosComponent    {

  visible = true;

  displayedColumns: string[] = ['Titulo', 'Descripción', 'Desarrollador','Fecha Inicio','Fecha Fin','Estado','Acciones'];
  dataSource: any = [];
  idProyecto = signal(0);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  clickedRows  = new Set<Proyectos>();
  proyectos: Proyectos[] = [];

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.proyectoService.getProyectos()

    .subscribe((proyectos) => {
        this.proyectos = proyectos;
        for (let index = 0; index < proyectos.length; index++) {
          this.dataSource = new MatTableDataSource(proyectos);
        // console.table(proyectos);
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource);
          
          
        } 

      }

      );
      
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   
  }

  setClass(Proyectos: Proyectos){
    if(Proyectos.estado.estado == "En curso" ){
      return 'enCurso';
    }else if(Proyectos.estado.estado == "Pendiente"){
      return 'pendiente';
    }else if(Proyectos.estado.estado == "Culminado"){
      return 'culminado';
    }else{
      return 'cancelado';
    }
  }


  
  setIdProyecto(clickedRows: any){
    if (clickedRows) { // Verifica si existe
      console.table(clickedRows.idProyecto);
      this.idProyecto.set(clickedRows.idProyecto); //asinando idProyecto a la signal idProyecto
      this.visible = !this.visible
    } else {
      console.warn("idProyecto no está definido o es inaccesible en clickedRows.");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    this.visible = !this.visible;

  }
  
  
  
}
