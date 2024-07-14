import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { Empleados } from '../../../../models/empleados';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../../mat-angular/alert/alert.component';


@Component({
  selector: 'app-editar-desarrollador',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatInput,MatFormFieldModule,MatFormField],
  templateUrl: './editar-desarrollador.component.html',
  styleUrl: './editar-desarrollador.component.css'
})
export class EditarDesarrolladorComponent {
@Output () updateEmpleado = new EventEmitter<void>();

  DurationInSeconds=5;
  formEmpleadoEdit: FormGroup;
  textButton= signal("Campos invalidos");
  @Input() hideEditForm = signal(false);
  @Input() desarrollador: Empleados[] = [];
  errorMessage = signal('');
  constructor(private fb: FormBuilder, private proyectoService: ProyectoService, private snackBar: MatSnackBar) {
    this.formEmpleadoEdit = this.fb.group({

      empleado_seccion: this.fb.group({
        idEmpleado: [''],
        nombre_empleado: [''],
        dni_empleado: [''],
        correo_empleado: [''],
        usuario: [''],
      }),
     
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.desarrollador.map((desarrollador) => {

      this.formEmpleadoEdit.patchValue({

        empleado_seccion: {
          idEmpleado: desarrollador.idEmpleado,
          nombre_empleado: desarrollador.nombre_empleado,
          dni_empleado: desarrollador.dni_empleado,
          correo_empleado: desarrollador.correo_empleado,
          usuario: desarrollador.usuario
        }
      });

      if(this.formEmpleadoEdit.get('empleado_seccion')?.valid){
        this.textButton.set("Actualizar empleado");
      }
    });

    console.log(changes); 
  }


  actualizarEmpleado(){
    const idEmpleado= this.formEmpleadoEdit.get('empleado_seccion')?.get('idEmpleado')?.value;
    console.log(idEmpleado);
    this.proyectoService.updateEmpleado(idEmpleado,this.formEmpleadoEdit.get('empleado_seccion')?.value)
    .subscribe((desarrollador) => {
      //console.log(desarrollador);
      if(desarrollador){
        this.openSnackBar("Empleado actualizado correctamente");
      }
      this.formEmpleadoEdit.reset();
      this.textButton.set("Campos invalidos")
      this.mostrarEditForm();
      this.updateEmpleado.emit();
    },
    (error) => {
      this.errorMessage.set(error.message);
    });
  }

  mostrarEditForm(){
    this.hideEditForm.update(prevstate => !prevstate);
  }

  changeValue(event: KeyboardEvent){

    if(this.formEmpleadoEdit.get('empleado_seccion')?.valid){
      this.textButton.set("Actualizar empleado");
    }else{
      this.textButton.set("Campos invalidos");
    }
    
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(AlertComponent, {
      data: {message: message},
      duration: this.DurationInSeconds*1000,
    })
  }


}
