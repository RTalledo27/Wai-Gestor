import { Component, Input, output, Output, Signal, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CotizacionService } from '../../../../../services/cotizacion.service';
import { Elementos } from '../../../../../models/elementos';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { AlertComponent } from '../../../../mat-angular/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-editar-elemento',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-elemento.component.html',
  styleUrl: './editar-elemento.component.css'
})
export class EditarElementoComponent {

  formElementoEdit: FormGroup;

  textButton= signal("Campos invalidos");
  @Input() hideEditForm = signal(false);
  @Input() elementos: Elementos[] = [];
  durationInSeconds: number= 5;

  constructor( private fb: FormBuilder, private proyectoService: ProyectoService, private _snackBar: MatSnackBar) {

    this.formElementoEdit = this.fb.group({
      elemento_seccion: this.fb.group({
        idElemento: ['',[Validators.required]],
        nombre_elemento: ['',[Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
        costo: ['',[Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
        descripcion: ['', [Validators.required, Validators.minLength(3)]]
      }),
     
    });
   }


   ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    console.log(this.elementos)
    this.elementos.map((elemento) => {
      console.log(elemento);
      this.formElementoEdit.patchValue({

        elemento_seccion: {
          idElemento: elemento.idElemento,
          nombre_elemento: elemento.nombre_elemento,
          costo: elemento.costo,
          descripcion: elemento.descripcion
        }
      });

      if(this.formElementoEdit.get('elemento_seccion')?.valid){
        console.log('Formulario válido');
        this.textButton.set("Registrar elemento");
      }
  });
    
   }


   

   actualizarElemento(){
    if(this.formElementoEdit.valid){
      this.proyectoService.updateElemento(this.elementos[0].idElemento, this.formElementoEdit.get('elemento_seccion')?.value).subscribe((elemento) => {
        if(elemento){
          this.openSnackBar("Elemento actualizado correctamente📝");
        this.mostrarEditForm();

        }
        
    });
    }
   }

   mostrarEditForm(){
    this.hideEditForm.update(prevstate => !prevstate);
   }

   changeValue(event: KeyboardEvent){
    const value = (event.target as HTMLInputElement).value;
    if(this.formElementoEdit.get('elemento_seccion')?.valid){
      console.log('Formulario válido');
      this.textButton.set("Registrar elemento");
    }else{
      console.log('Formulario inválido');
      this.textButton.set("Campos invalidos");
    }
   }

   openSnackBar(message: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message: message }
    });
  }


}
