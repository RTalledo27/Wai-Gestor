import { Component, EventEmitter, Input, output, Output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CotizacionService } from '../../../../../services/cotizacion.service';
import { Elementos } from '../../../../../models/elementos';
import { MatSelectChange } from '@angular/material/select';
import { AlertComponent } from '../../../../mat-angular/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-nuevo-elemento',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nuevo-elemento.component.html',
  styleUrl: './nuevo-elemento.component.css'
})
export class NuevoElementoComponent {

  @Output() addElement = new EventEmitter<void>();

  formElementoNuevo: FormGroup;
  textButton= signal("Campos invalidos");
  @Input() hideNuevoForm = signal(false);
  elementos: Elementos[] = [];
  durationInSeconds: number= 5;

  constructor( private fb: FormBuilder, private cotizacionService: CotizacionService, private _snackBar: MatSnackBar) {

    this.formElementoNuevo = this.fb.group({
      elemento_seccion: this.fb.group({
        nombre_elemento: ['',[Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
        costo: ['',[Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
        descripcion: ['', [Validators.required, Validators.minLength(3)]],
        isActive: 1,
      }),
     
    });
   }


mostrarNuevoForm(){
    this.hideNuevoForm.update(prevstate => !prevstate);
   }

   changeValue(event: KeyboardEvent){
    const value = (event.target as HTMLInputElement).value;
    if(this.formElementoNuevo.get('elemento_seccion')?.valid){
      console.log('Formulario válido');
      this.textButton.set("Registrar elemento");
    }
   }


   registrarElemento(){
    if(this.formElementoNuevo.get('elemento_seccion')?.valid){
      const elemento = this.formElementoNuevo.get('elemento_seccion')?.value;
       this.cotizacionService.registrarElemento(elemento).subscribe((elemento) => {
        
        if(elemento){
          this.openSnackBar('Elemento nuevo registrado!');
         this.mostrarNuevoForm();
         this.addElement.emit();
        }


        });
    }else{
      console.log('Elemento no registrado');
   }
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message: message }
    });
  }
   

 

}
