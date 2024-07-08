import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { Empleados } from '../../../../models/empleados';
import { Roles } from '../../../../models/roles';
import { ProyectoService } from '../../../../services/proyecto.service';
@Component({

  selector: 'app-nuevo-desarrollador',
  standalone: true,
  imports: [ MatOption,MatSelect,MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './nuevo-desarrollador.component.html',
  styleUrl: './nuevo-desarrollador.component.css'
})
export class NuevoDesarrolladorComponent {

  formNuevoDesarrollador: FormGroup;
  empleados: Empleados[] = [];
  roles: Roles[] = [];
  @Input() hideNuevoForm= signal(false);
  textButton= signal("Campos invalidos");
  
  constructor( private fb: FormBuilder, private proyectoService: ProyectoService) {

    this.formNuevoDesarrollador = this.fb.group({
      seccion_empleado: this.fb.group({
        usuario: ['',[Validators.required, Validators.minLength(3)]],
        nombre_empleado: ['',[Validators.required, Validators.minLength(3)]],
        dni_empleado: ['',[Validators.required, Validators.minLength(8)]],
        correo_empleado: ['',[Validators.required, Validators.email]],
        contraseña: ['',[Validators.required, Validators.minLength(8)]],
        idRol: ['',[Validators.required, Validators.minLength(3)]],
       confirmar_contraseña: ['',[Validators.required, Validators.minLength(8)]],

      }),


    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.proyectoService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.proyectoService.getRoles().subscribe((roles) => {
      this.roles = roles;
      console.table(roles);
    }); 
  }


  changeValue(event: KeyboardEvent){
    const value = (event.target as HTMLInputElement).value;
    if(this.formNuevoDesarrollador.valid){
      //console.log('Formulario válido');
      this.textButton.set("Registrar empleado");
    }else{
      //console.log('Formulario inválido');
      this.textButton.set("Campos inválidos");
    }
  }

  mostrarNuevoForm(){
    this.hideNuevoForm.update(prevstate => !prevstate);
  }

  changeValueSelect(event: MatSelectChange){
    const idEmpleado = event.value;
    if(this.formNuevoDesarrollador.valid){
      //console.log('Formulario válido');
      this.textButton.set("Registrar empleado");
      //console.log(this.formNuevoDesarrollador.get('seccion_empleado')?.value);  
    };
  }

  registrarEmpleado(){

    if(this.formNuevoDesarrollador.get('seccion_empleado')?.valid){
     
      const empleadoData= this.formNuevoDesarrollador.get('seccion_empleado')?.value;
      console.table(empleadoData);
      this.proyectoService.registrarEmpleado(empleadoData).subscribe((empleado) => {
        this.mostrarNuevoForm();
        this.empleados.push(empleado);
        console.log('Empleado registrado');
      });

    }else{
      console.log('Empleado no registrado');
    }
  }
}
