import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { ProyectoService } from '../../../../services/proyecto.service';
import { Proyectos } from '../../../../models/proyectos';
import { CommonModule, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Empleados } from '../../../../models/empleados';
import { Cotizaciones } from '../../../../models/cotizaciones';
import { CotizacionService } from '../../../../services/cotizacion.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatOption } from '@angular/material/core';
import { Elementos } from '../../../../models/elementos';
import { map, Observable, startWith } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { EstadoService } from '../../../../services/estado.service';
import { Estados } from '../../../../models/estados';
import { Clientes } from '../../../../models/clientes';
import { ClienteService } from '../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../../mat-angular/alert/alert.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatLabel,
    MatAutocomplete,
    MatOptionModule,
    MatOption,
    MatAutocompleteModule,
    CommonModule,
    MatDivider,
    MatList,
    MatListItem,
    MatIcon
  ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {

  @Output() updateProyecto = new EventEmitter<void>();
  durationInSeconds = 5;
  formEdit: FormGroup;
  @Input({ required: true }) idProyecto: any;
  visible = true;
  myControl = new FormControl('');
  elementos: Elementos[] = [];
  estados: Estados[] = [];
  selectedElementos: any[] = [];
  subTotal = signal<number>(0);
  descuento = signal<number>(0);
  total = signal<number>(0);
  filteredOptions: Observable<string[]> | undefined;

  constructor(private proyectoService: ProyectoService, private clienteService: ClienteService,private cotizacionService: CotizacionService, private estadoService: EstadoService, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.formEdit = this.fb.group({
      proyecto_seccion: this.fb.group({
        nombre_proyecto: ['', Validators.required],
        descripcion: ['', Validators.required],
        fecha_inicio: ['', Validators.required],
        fecha_fin: ['', Validators.required],
      }),
      cliente_seccion: this.fb.group({
        idCliente: ['', Validators.required],
        nombre_cliente: ['', Validators.required],
        correo_cliente: ['', Validators.required],
        telefono_cliente: ['', Validators.required],
        dni_cliente: ['', Validators.required],
      }),
      empleado_seccion: this.fb.group({
        idEmpleado: ['', Validators.required],
        nombre_empleado: ['', Validators.required],
        dni_empleado: ['', Validators.required],
        correo_empleado: ['', Validators.required],
      }),
      estado_seccion: this.fb.group({
        idEstado: ['', Validators.required],
        estado: ['']
      }),
      cotizacion_seccion: this.fb.group({
        fecha: new Date(),
        subtotal: [0, Validators.required],
        descuento: [0, Validators.required],
        total: [0, Validators.required],
      })
    });
  }

  proyecto: Proyectos[] = [];
  empleados: Empleados[] = [];
  cotizacion: Cotizaciones[] = [];

  ngOnInit(): void {
    this.proyectoService.getProyecto(this.idProyecto).subscribe((proyecto) => {
      this.proyecto.push(proyecto);
      this.proyectoService.getEmpleados().subscribe((empleados) => {
        this.empleados = empleados;
        this.loadCotizacion(this.idProyecto);
        this.formEdit.patchValue({
          proyecto_seccion: proyecto,
          cliente_seccion: proyecto.cliente,
          empleado_seccion: proyecto.empleado,
          estado_seccion: proyecto.estado,
        });
      });
    });

    this.proyectoService.getElementos().subscribe((elementos) => {
      this.elementos = elementos;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });


    this.estadoService.getEstados().subscribe((estados) => {
      this.estados = estados;
    });
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.elementos
      .filter(elemento => elemento.nombre_elemento.toLowerCase().includes(filterValue))
      .map(elemento => elemento.nombre_elemento);
  }

  visibleProyecto() {
    this.visible = !this.visible;
  }

  changeValueDescuento(event: KeyboardEvent) {
    const descuentoElement = event.target as HTMLInputElement;
    const descuentoValue = Number(descuentoElement.value);
    this.descuento.set(descuentoValue);
    const newTotal = this.subTotal() - this.descuento();
    this.total.set(newTotal);
    this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
    console.log(this.total());
  }

  addElemento(event: MatAutocompleteSelectedEvent) {
    const elemento = this.elementos.find(elemento => elemento.nombre_elemento === event.option.viewValue);
    if (elemento && !this.selectedElementos.includes(elemento)) {
      this.selectedElementos = [...this.selectedElementos, elemento];
      this.subTotal.set(Number(this.subTotal()) + Number((elemento.costo || 0)));
      this.formEdit.get('cotizacion_seccion')?.get('subtotal')?.patchValue(this.subTotal());
      this.total.set(this.subTotal() - this.descuento());
      this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
      this.formEdit.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
      this.myControl.reset();
    } else {
      alert('Elemento ya seleccionado');
    }
    console.log(this.subTotal());
  }

  loadCotizacion(idProyecto: number) {
    console.log('Loading cotizacion for idProyecto:', idProyecto);
    this.loadElementos(idProyecto);
    this.cotizacionService.getCotizacionByID(idProyecto).subscribe(
      (cotizacion) => {
        console.log('Cotizacion received:', cotizacion);
        
        if (cotizacion) {
          // Rellenar el formulario con los datos de la cotización
          this.formEdit.get('cotizacion_seccion')?.patchValue(cotizacion);

          // Verificar y asignar los elementos
          const elementos = cotizacion.elementos || cotizacion['elementos'] || [];
          if (elementos && Array.isArray(elementos) && elementos.length > 0) {
            console.log('Elementos encontrados:', elementos);
            this.selectedElementos = elementos.map(e => e.nombre_elemento);
          } else {
            console.log('No se encontraron elementos');
            this.selectedElementos = [];
          }

          // Mostrar la tabla de elementos para depuración
          console.table(this.selectedElementos);
        } else {
          console.log('Sin cotizaciones para el proyecto:', idProyecto);
        }
      },
      (error) => {
        console.error('Error retrieving cotizacion:', error);
      }
    );
  }


  deleteElemento(elemento: Elementos) {
    this.selectedElementos = this.selectedElementos.filter(e => e.idElemento !== elemento.idElemento);
    console.log(this.selectedElementos);
    this.subTotal.set(this.subTotal() - elemento.costo);
    this.total.set(this.total() - elemento.costo);
    this.formEdit.get('cotizacion_seccion')?.get('subtotal')?.patchValue(this.subTotal());
    this.formEdit.get('cotizacion_seccion')?.get('descuento')?.patchValue(this.descuento());
    this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
    this.formEdit.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
  }

  changeValueEstado(event: MatSelectChange) {
    const idEstado = event.value;
    const estado = this.estados.find(estado => estado.idEstado === idEstado);
    this.formEdit.get('estado_seccion')?.get('idEstado')?.patchValue(estado?.idEstado);
    this.formEdit.get('estado_seccion')?.get('estado')?.patchValue(estado?.estado);

  }

  changeValueDesarrollador(event: MatSelectChange){
    const idEmpleado = event.value;
    this.proyectoService.getProyectos().subscribe((proyectos) => {


      const empleado_proyecto_pendiente = proyectos.find(proyecto => 
        proyecto.empleado.idEmpleado === idEmpleado && proyecto.estado.idEstado === 1
      ); 

      const empleado_proyecto_en_proceso = proyectos.find(proyecto =>
        proyecto.empleado.idEmpleado === idEmpleado && proyecto.estado.idEstado === 2
      );

      if(empleado_proyecto_pendiente || empleado_proyecto_en_proceso){
        alert('El empleado ya cuenta con un proyecto');
        this.formEdit.get('desarrollador_seccion')?.reset();
      }else{
        const empleado = this.empleados.find(empleado => empleado.idEmpleado === idEmpleado);
    this.formEdit.get('empleado_seccion')?.get('idEmpleado')?.patchValue(empleado?.idEmpleado);
    this.formEdit.get('empleado_seccion')?.get('nombre_empleado')?.patchValue(empleado?.nombre_empleado);
    this.formEdit.get('empleado_seccion')?.get('dni_empleado')?.patchValue(empleado?.dni_empleado);
    this.formEdit.get('empleado_seccion')?.get('correo_empleado')?.patchValue(empleado?.correo_empleado);
      }
    });
    
  }

  actualizarProyecto(){
    const proyecto = this.formEdit.get('proyecto_seccion')?.value;
    const cliente = this.formEdit.get('cliente_seccion')?.value;
    const empleado = this.formEdit.get('empleado_seccion')?.value;
    const estado = this.formEdit.get('estado_seccion')?.value;
    const cotizacion = this.formEdit.get('cotizacion_seccion')?.value;
   // cotizacion['elementos'] = this.selectedElementos;

   console.log(cotizacion);
    const proyectoActualizado = {
      ...proyecto,
      empleado: empleado.idEmpleado,
      idEstado: estado.idEstado,
      cotizacion
    };

    const clienteActualizado = {
      ...cliente,
      idCliente: cliente.idCliente
      
    };

    console.table(clienteActualizado);
    console.table(proyectoActualizado);


    this.clienteService.updateCliente(cliente.idCliente,clienteActualizado).subscribe(

      () => {
        this.proyectoService.updateProyecto(this.idProyecto,proyectoActualizado).subscribe(
      (proyecto) => {
        if(proyecto){
          this.openSnackBar('Proyecto actualizado correctamente','Cerrar');
          this.updateProyecto.emit();
          console.table(proyecto);

        }else{
          this.openSnackBar('Error al actualizar el proyecto','Cerrar');
          console.table(proyecto);
        }

        },
      (error) => {
        console.error('Error updating proyecto:', error);
      }
    );
      },
      (error) => {
        console.error('Error updating cliente:', error);
      }
    );
    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: this.durationInSeconds*1000,
      data: { message, action },
    });
  }


  //CARGAR ELEMENTOS SELECCIONADOS

  loadElementos(idProyecto: number) {
    const elementos = this.cotizacionService.getCotizacionByID(idProyecto)
    .pipe(map(cotizacion => cotizacion.elementos) );
     console.log(elementos);
  }

}
