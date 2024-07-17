import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { ProyectoService } from '../../../../services/proyecto.service';
import { Proyectos } from '../../../../models/proyectos';
import { CommonModule, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Empleados } from '../../../../models/empleados';
import { Cotizaciones } from '../../../../models/cotizaciones';
import { CotizacionService } from '../../../../services/cotizacion.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatOption } from '@angular/material/core';
import { Elementos } from '../../../../models/elementos';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { EstadoService } from '../../../../services/estado.service';
import { Estados } from '../../../../models/estados';
import { Clientes } from '../../../../models/clientes';
import { ClienteService } from '../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../../mat-angular/alert/alert.component';
import { MatIcon } from '@angular/material/icon';
import { fechaFinValidator, fechaInicioValidator, validDateValidator } from '../../../../validaciones/custom-validators';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ElementosCotizacion } from '../../../../models/elementos_cotizacion';


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
    MatIcon,MatError,
    MatDatepicker,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {

  @Output() updateProyecto = new EventEmitter<void>();
  durationInSeconds = 5;
  formEdit: FormGroup;
  @Input({ required: true }) idProyecto: any;
  @Input({required: true}) idCotizacion: any;
  visible = true;
  myControl = new FormControl('');
  elementos: Elementos[] = [];
  estados: Estados[] = [];
  selectedElementos: any[] = [];
  subTotal = signal<number>(0);
  descuento = signal<number>(0);
  total = signal<number>(0);
  filteredOptions: Observable<string[]> | undefined;
  loadingComplete = false;

  constructor(private proyectoService: ProyectoService, private clienteService: ClienteService,private cotizacionService: CotizacionService, private estadoService: EstadoService, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.formEdit = this.fb.group({
      proyecto_seccion: this.fb.group({
        nombre_proyecto: ['' ],
        descripcion: [''],
        fecha_inicio: ['' ],
        fecha_fin: ['' ],
      }),
      cliente_seccion: this.fb.group({
        idCliente: ['' ],
        nombre_cliente: ['' ],
        correo_cliente: ['' ],
        telefono_cliente: ['' ],
        dni_cliente: ['' ],
      }),
      empleado_seccion: this.fb.group({
        idEmpleado: [''],
        nombre_empleado: ['' ],
        dni_empleado: [''],
        correo_empleado: ['' ],
      }),
      estado_seccion: this.fb.group({
        idEstado: ['' ],
        estado: ['']
      }),
      cotizacion_seccion: this.fb.group({
        fecha: new Date(),
        subtotal: [0 ],
        descuento: [0],
        total: [0 ],
      })
    });
  }

  proyecto: Proyectos[] = [];
  empleados: Empleados[] = [];
  cotizacion: Cotizaciones[] = [];

  ngOnInit(): void {
    //CARGAR DATA DEL FORMULARIO DE EDITAR CON LOS DATOS DEL PROYECTO
    this.loadDataEditForm();

   
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
    alert(this.subTotal())
    const descuentoValue = Number(descuentoElement.value);
    this.descuento.set(descuentoValue);
    const newTotal = this.subTotal() - this.descuento();
    this.total.set(newTotal);
    this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
    console.log(this.total());
  }

  addElemento(event: MatAutocompleteSelectedEvent) {
    console.log('Event:', event);
    console.log('Event Option ViewValue:', event.option.viewValue);
    console.log('Elementos disponibles:', this.elementos);

    const elemento = this.elementos.find(elemento => elemento.nombre_elemento === event.option.viewValue);
    console.log('Elemento encontrado:', elemento);

    if (elemento) {
      if (!this.selectedElementos.some(e => e.idElemento === elemento.idElemento)) {
        this.selectedElementos = [...this.selectedElementos, elemento];
        const descuento = this.formEdit.get('cotizacion_seccion')?.get('descuento')?.value;
        // Recalcular el subtotal y el total
        const nuevoSubTotal = this.selectedElementos.reduce((sum, elem) => sum + Number(elem.costo), 0);
        this.descuento.set(descuento);
        const descuentoAplicado = this.descuento(); // Asumiendo que descuento() devuelve un número
        const nuevoTotal = nuevoSubTotal - descuentoAplicado;
       
        // Actualizar los valores
        this.subTotal.set(nuevoSubTotal);
        this.total.set(nuevoTotal);

        // Actualizar el formulario
        this.formEdit.get('cotizacion_seccion')?.get('subtotal')?.patchValue(nuevoSubTotal);
        this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(nuevoTotal);
        this.formEdit.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
        this.myControl.reset();
      } else {
        alert('Elemento ya seleccionado');
      }
    } else {
        console.error('Elemento no encontrado');
    }
    console.log(this.subTotal());
}
  loadCotizacion(idProyecto: number) {
    console.log('Loading cotizacion for idProyecto:', idProyecto);
    this.loadElementos(idProyecto);
    
  }


  deleteElemento(elemento: Elementos) {
     // Filtrar los elementos para eliminar el seleccionado
     this.selectedElementos = this.selectedElementos.filter(e => e.idElemento !== elemento.idElemento);
    
     // Recalcular los valores de subtotal y total
     const nuevoSubTotal = this.selectedElementos.reduce((sum, elem) => sum + Number(elem.costo), 0);
     const nuevoTotal = nuevoSubTotal - this.descuento();
 
     // Actualizar los valores
     this.subTotal.set(nuevoSubTotal);
     this.total.set(nuevoTotal);
 
     // Actualizar el formulario
     this.formEdit.get('cotizacion_seccion')?.get('subtotal')?.patchValue(nuevoSubTotal);
     this.formEdit.get('cotizacion_seccion')?.get('total')?.patchValue(nuevoTotal);
     this.formEdit.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
     
     this.deleteElementos(this.idCotizacion);
     console.log('Elemento eliminado:', elemento);
     console.log('Elementos seleccionados:', this.selectedElementos);
     console.log('Nuevo Subtotal:', nuevoSubTotal);
     console.log('Nuevo Total:', nuevoTotal);
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

  actualizarProyecto() {
    const proyecto = this.formEdit.get('proyecto_seccion')?.value;
    const cliente = this.formEdit.get('cliente_seccion')?.value;
    const empleado = this.formEdit.get('empleado_seccion')?.value;
    const estado = this.formEdit.get('estado_seccion')?.value;
    const cotizacion = this.formEdit.get('cotizacion_seccion')?.value;
    
    // Agregar elementos seleccionados a la cotización
    cotizacion.elementos = this.selectedElementos;

    console.log(cotizacion);
    
    // Crear el objeto combinado para actualizar el proyecto
    const proyectoActualizado = {
        ...proyecto,
        idEmpleado: empleado.idEmpleado,
        idEstado: estado.idEstado,
        idCliente: cliente.idCliente,
        cotizacion: {
            idCotizacion: cotizacion.idCotizacion,
            fecha_cotizacion: cotizacion.fecha_cotizacion,
            subtotal: cotizacion.subtotal,
            descuento: cotizacion.descuento,
            total: cotizacion.total,
            elementos: cotizacion.elementos
        }
    };

    const cotizacionData= {
      ...cotizacion,
      idProyecto: this.idProyecto,
      idEstado: cotizacion.id,
      idEmpleado: empleado.idEmpleado,
      idCliente: cliente.idCliente,
      elementos: this.selectedElementos

    }

    console.table(proyectoActualizado);

    // Actualizar el cliente, luego el proyecto y finalmente la cotización
    this.clienteService.updateCliente(cliente.idCliente, cliente).subscribe(
        () => {
            this.proyectoService.updateProyecto(this.idProyecto, proyectoActualizado).subscribe(
                (proyecto) => {
                    if (proyecto) {
                          
                      this.cotizacionService.updateCotizacion(this.idProyecto, cotizacionData).subscribe(
                        (cotizacionActualizada) => {
                            console.log('Cotización actualizada exitosamente', cotizacionActualizada);
                            // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
                            this.openSnackBar('Cotización actualizada exitosamente', 'Cerrar');
                            if(cotizacionActualizada){
                              this.selectedElementos.forEach(elemento => {
                                 const elemento_cotizacionData= {
                                  idCotizacion: cotizacionActualizada.idCotizacion,
                                  idElemento: Number(elemento.idElemento),

                                 }
                                 this.cotizacionService.registrarElemento_cotizacion(elemento_cotizacionData as unknown as Elementos).subscribe({
                                  next: (elemento_cotizacion) => {
                                      console.log('Elemento cotización registrado:', elemento_cotizacion);
                                  }
                                    
                                  

                                  
                              });

                            }
                            );
                            this.updateProyecto.emit()
                            this.openSnackBar('Elementos registrados exitosamente', 'Cerrar');
                            }
                        },
                        (errorCotizacion) => {
                            console.error('Error al actualizar la cotización:', errorCotizacion);
                            this.openSnackBar('Error al actualizar la cotización', 'Cerrar');
                        }
                    );
                            
                        
                    } else {
                        this.openSnackBar('Error al actualizar el proyecto', 'Cerrar');
                        console.table(proyecto);
                    }
                },
                (error) => {
                    console.error('Error al actualizar el proyecto:', error);
                    this.openSnackBar('Error al actualizar el proyecto', 'Cerrar');
                }
            );
        },
        (error) => {
            console.error('Error al actualizar el cliente:', error);
            this.openSnackBar('Error al actualizar el cliente', 'Cerrar');
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
    this.cotizacionService.getCotizacionByID(idProyecto).subscribe((cotizacion) => {
        console.log('Cotización recibida:', cotizacion); // Verifica la estructura de los datos recibidos
        if (cotizacion) {
            this.formEdit.get('cotizacion_seccion')?.patchValue(cotizacion);
            const elementos = cotizacion.elementos ?? [];

            if (elementos.length > 0) {
                console.log('Elementos encontrados:', elementos);
                this.selectedElementos = elementos.map((elem: any) => {
                    console.log('Elemento recibido:', elem); // Verifica cada elemento individualmente
                
                    return {
                        idElemento: elem.idElemento,
                        nombre_elemento: elem.elemento?.nombre_elemento,
                        descripcion: elem.elemento?.descripcion,
                        costo: elem.elemento?.costo,
                        isActive: elem.elemento?.isActive
                    };
                });
                console.log('Elementos seleccionados:', this.selectedElementos);
            } else {
                console.log('No se encontraron elementos');
                this.selectedElementos = [];
            }
            console.table(this.selectedElementos);

            // Calcular el subtotal después de cargar los elementos
            const subtotal = this.selectedElementos.reduce((acc, elem) => acc + elem.costo, 0);
            const descuento = 
            console.log('Subtotal elementos seleccionados:', subtotal, this.descuento());
            const total = subtotal - this.descuento();
            //ASIGNAR VALIR A SIGNAL
            this.subTotal.set(subtotal);
            this.total.set(total);

            
        } else {
            console.log('Sin cotizaciones para el proyecto:', idProyecto);
        }
    });
}



  //CARGAR DATA DEL FORMULARIO DE EDITAR CON LOS DATOS DEL PROYECTO
  loadDataEditForm(){
   // Usar forkJoin para esperar a que todas las solicitudes se completen
  forkJoin([
    this.proyectoService.getProyecto(this.idProyecto),
    this.proyectoService.getEmpleados(),
    this.proyectoService.getElementos(),
    this.estadoService.getEstados()
  ]).subscribe(([proyecto, empleados, elementos, estados]) => {
    // Procesar los datos recibidos
    this.proyecto.push(proyecto);
    this.empleados = empleados;
    this.elementos = elementos;
    this.estados = estados;

    // Configurar el formulario con los datos del proyecto
    this.formEdit.patchValue({
      proyecto_seccion: proyecto,
      cliente_seccion: proyecto.cliente,
      empleado_seccion: proyecto.empleado,
      estado_seccion: proyecto.estado,
    });

    // Configurar las opciones filtradas
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    // Indicar que la carga de datos está completa
    this.loadingComplete = true;

    // Llamar a la función de validación
    this.validateForm();

    this.loadCotizacion(this.idProyecto);
  });
}

// VALIDAR FORMULARIO
validateForm() {
  if (this.loadingComplete) {
    const fechaInicioControl = this.formEdit.get('proyecto_seccion.fecha_inicio');
    const fechaFinControl = this.formEdit.get('proyecto_seccion.fecha_fin');

    if (fechaInicioControl && fechaFinControl) {
      fechaFinControl.setValidators([Validators.required, validDateValidator(), fechaFinValidator(fechaInicioControl)]);
      fechaFinControl.updateValueAndValidity();
    }
    // Sección proyecto
    this.formEdit.get('proyecto_seccion.nombre_proyecto')?.setValidators([Validators.required]);
    this.formEdit.get('proyecto_seccion.descripcion')?.setValidators([Validators.required]);
    this.formEdit.get('proyecto_seccion.fecha_inicio')?.setValidators([Validators.required, validDateValidator(),fechaInicioValidator()]);
    this.formEdit.get('proyecto_seccion.fecha_fin')?.setValidators([Validators.required, validDateValidator()]);
    
    // Sección cliente
    this.formEdit.get('cliente_seccion.nombre_cliente')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]+$')]);
    this.formEdit.get('cliente_seccion.correo_cliente')?.setValidators([Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]);
    this.formEdit.get('cliente_seccion.telefono_cliente')?.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]);
    this.formEdit.get('cliente_seccion.dni_cliente')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]+$')]);
    
    // Sección empleado
    this.formEdit.get('empleado_seccion.nombre_empleado')?.setValidators([Validators.required]);
    this.formEdit.get('empleado_seccion.correo_empleado')?.setValidators([Validators.required, Validators.email]);
    this.formEdit.get('empleado_seccion.dni_empleado')?.setValidators([Validators.required]);
    
    // Sección estado
    this.formEdit.get('estado_seccion.estado')?.setValidators([Validators.required]);
    
    // Sección cotización
    this.formEdit.get('cotizacion_seccion.subtotal')?.setValidators([Validators.required]);
    this.formEdit.get('cotizacion_seccion.descuento')?.setValidators([Validators.required]);
    this.formEdit.get('cotizacion_seccion.total')?.setValidators([Validators.required]);

    // Actualizar validez y valor de todo el formulario
    this.formEdit.updateValueAndValidity();

   
  }
}



///ELIMINAR ELEMENTO DE BASE DE DATOS
deleteElementos(idCotizacion: number) {
  this.cotizacionService.deleteElementos(idCotizacion).subscribe(
    () => {
      console.log('Elemento eliminado exitosamente');
      this.openSnackBar('Elemento eliminado exitosamente', 'Cerrar');
    }
  );
}


}



