import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ElementosCotizacion } from '../../../../models/elementos_cotizacion';
import { CotizacionService } from '../../../../services/cotizacion.service';
import { Elementos } from '../../../../models/elementos';
import { NuevoElementoComponent } from './nuevo-elemento/nuevo-elemento.component';
import { EditarElementoComponent } from './editar-elemento/editar-elemento.component';
import { DialogCardComponent } from '../../../mat-angular/dialog-card/dialog-card.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProyectoService } from '../../../../services/proyecto.service';
import { LoginService } from '../../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../../mat-angular/alert/alert.component';

@Component({
  selector: 'app-elementos',
  standalone: true,
  imports: [MatTableModule,NgFor, MatIcon,MatPaginatorModule,MatInputModule,MatFormFieldModule,MatSortModule,CommonModule,NuevoElementoComponent,EditarElementoComponent],
  templateUrl: './elementos.component.html',
  styleUrl: './elementos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ElementosComponent {
  displayedColumns: string[] = ['idElemento', 'Nombre_elemento', 'costo', 'descripcion','edit','delete'];
  dataSource: any = [];
  visible=false;
  hideNuevoForm= signal(false);
  hideEditForm= signal(false);
  elemento: Elementos[] = [];
  idRol = signal(0);
  durationInSeconds= 5;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //clickedRows  = new Set<ElementosCotizacion>();
  elementos: Elementos[] = [];

  constructor(private cotizacionService: CotizacionService, private dialog: MatDialog, private proyectoService: ProyectoService, private loginService:LoginService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataLogin();
    this.loadElementos();
  }

  loadElementos(){
    this.cotizacionService.getElementos()
    .subscribe((elementos) => {
      this.elementos = elementos;
      this.dataSource = new MatTableDataSource(elementos);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


 

mostrarNuevoForm(){
  if(this.idRol() == 1){
   this.hideNuevoForm.update(prevstate => !prevstate);
  }else{
    this.openSnackBar('No tienes permisos para realizar esta acción');
  }
   }

   mostrarEditForm(elemento: Elementos){
    if(this.idRol() == 1 ){
      this.hideEditForm.update(prevstate => !prevstate);
      this.elemento = [elemento];
    }else{
      this.openSnackBar('No tienes permisos para realizar esta acción');
    }
 


   }


   openDialogCard(elemento:Elementos){
   
    const dialogRef = this.dialog.open(DialogCardComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) { // Verificar si result está definido
        if (result) {
          if(this.idRol() == 1){
            this.proyectoService.deleteElementoByID(elemento.idElemento).subscribe((elemento) => {
              console.log('Elemento eliminado:', elemento);
              this.cotizacionService.getElementos()
              .subscribe((elementos) => {
                console.table(elementos);
                for (let index = 0; index < elementos.length; index++) {
                  this.dataSource = new MatTableDataSource(elementos);
                  this.dataSource.paginator = this.paginator;
                }
                
              });
              
            });
          }else{
            this.openSnackBar('No tienes permisos para realizar esta acción');
          }
         
          
        } else {
          console.log('Eliminación cancelada');
        }
      } else {
        console.log('Diálogo cerrado sin acción');
        // Puedes mostrar un mensaje al usuario o realizar alguna otra acción
      }
    });

    
   }

    //RECARGA CUANDO DETECTA QUE SE REALIZO UNA ACCION
    onElementAdded(){
       this.loadElementos(); 
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

      openSnackBar(message: string) {
        this._snackBar.openFromComponent(AlertComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: message }
        });
      }
       
}
