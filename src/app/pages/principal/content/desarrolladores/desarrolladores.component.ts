import { CommonModule, NgFor } from '@angular/common';
import { Component, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CotizacionService } from '../../../services/cotizacion.service';
import { ProyectoService } from '../../../services/proyecto.service';
import { NuevoDesarrolladorComponent } from './nuevo-desarrollador/nuevo-desarrollador.component';
import { Empleados } from '../../../models/empleados';
import { EditarDesarrolladorComponent } from "./editar-desarrollador/editar-desarrollador.component";
import { LoginService } from '../../../services/login.service';
import { find } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../mat-angular/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogCardComponent } from '../../mat-angular/dialog-card/dialog-card.component';
@Component({
    selector: 'app-desarrolladores',
    standalone: true,
    templateUrl: './desarrolladores.component.html',
    styleUrl: './desarrolladores.component.css',
    imports: [NuevoDesarrolladorComponent, MatTableModule, NgFor, MatIcon, MatPaginatorModule, MatInputModule, MatFormFieldModule, MatSortModule, CommonModule, EditarDesarrolladorComponent,DialogCardComponent ]
})
export class DesarrolladoresComponent {
  displayedColumns: string[] = ['nombre','dni','correo','edit','delete'];
  dataSource: any = [];
  visible=false;
  hideNuevoForm= signal(false);
  hideEditForm= signal(false);
empleados: Empleados[] = [];
  idRol= signal(0);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private proyectoService: ProyectoService, private loginService: LoginService,  private snackBar: MatSnackBar, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataLogin();
    this.loadempleados();
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

  mostrarNuevoForm(){
    if(this.idRol() == 1){
      this.hideNuevoForm.update(prevstate => !prevstate);
    }else{
      this.openSnackBar("No tienes permisos para crear un nuevo elemento");
    }
  }

  mostrarEditForm(desarrollador: Empleados){
    if(this.idRol() == 1){
      this.hideEditForm.update(prevstate => !prevstate);
    this.empleados = [desarrollador];
    }else{
      this.openSnackBar("No tienes permisos para editar un elemento");
    }
    
  }



  dataLogin(){
    this.loginService.dataLogin().subscribe({
      next: (data: any) => {
        if (data) {
          this.idRol.set(data.idRol);
          console.log(data);
        } else {
          console.warn(
            "The API response doesn't contain a 'nombre' property or the data is empty."
          );
        }
      }
     
    });
  }



  openDialogCard(desarrollador:Empleados){
    const dialogRef = this.dialog.open(DialogCardComponent, {
      width: '300px'
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result!==undefined){
        if(result){
          if(this.idRol() == 1){
            this.proyectoService.deleteEmpleadoById(desarrollador.idEmpleado).subscribe((desarrollador) => {
              console.log('Desarrollador eliminado:', desarrollador);
              this.openSnackBar("Desarrollador eliminado");
              this.loadempleados();
            });
          }else{
            this.openSnackBar("No tienes permisos para eliminar un elemento");
          }
        }else {
          console.log('Eliminación cancelada');
          this.openSnackBar('Accion cancelada');
        }
      } else {
        console.log('Diálogo cerrado sin acción');
        // Puedes mostrar un mensaje al usuario o realizar alguna otra acción
      }
    });
  }

  

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(AlertComponent,{
      data: {message:message},
      duration: 5000,
     
    })

  }

  loadempleados(){
    this.proyectoService.getEmpleados()
    .subscribe((empleados) => {
      console.table(empleados);
      for (let index = 0; index < empleados.length; index++) {
        this.dataSource = new MatTableDataSource(empleados);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
  onEmpleadoAdded(){
    this.loadempleados();
  }

}
