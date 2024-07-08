import { Component, Inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge, Observable, map, startWith } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule, formatDate } from '@angular/common';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { Empleados } from '../../../../../models/empleados';
import { Elementos } from '../../../../../models/elementos';
import { MatListModule } from '@angular/material/list';
import jsPDF from 'jspdf';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CotizacionService } from '../../../../../services/cotizacion.service';
import { MatIcon } from '@angular/material/icon';
import { fechaInicioValidator,fechaFinValidator,validDateValidator } from '../../../../../validaciones/custom-validators';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../../../../date-format.pipe';


@Component({
  selector: 'app-form-nuevo',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    MatIcon,
    DateFormatPipe
  ],
  templateUrl: './form-nuevo.component.html',
  styleUrls: ['./form-nuevo.component.css']
})
export class FormNuevoComponent {

  pdfSrc: SafeResourceUrl | null = null;
  formNuevo: FormGroup;
  errorMessage = '';
  empleados: Empleados[] = [];
  buttonText = signal('Campos Invalidos');
  visibleSeccionProyecto = true;
  visibleSeccionCliente = false;
  visibleSeccionDesarrollador = false;
  visibleSeccionCotizacion = false;
  disable = true;
  myControl = new FormControl('');
  elementos: Elementos[] = [];
  filteredOptions: Observable<string[]> | undefined;
  selectedElementos: any[] = [];
  subTotal = signal<number>(0);
  descuento = signal<number>(0);
  total = signal<number>(0);

  fecha = new Date();
  valueFecha = formatDate(this.fecha, 'dd-MM-AAAA', 'en-US');

  constructor(
    private proyectoService: ProyectoService,
    private cotizacionService: CotizacionService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.formNuevo = this.fb.group({
      proyecto_seccion: this.fb.group({
        nombre_proyecto: ['', Validators.required],
        descripcion: ['', Validators.required],
        fecha_inicio: ['', [Validators.required, fechaInicioValidator()]],
        fecha_fin: ['', [Validators.required, validDateValidator()]],
      }),
      cliente_seccion: this.fb.group({
        nombre_cliente: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        correo_cliente: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
        telefono_cliente: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]],
        dni_cliente: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
      }),
      desarrollador_seccion: this.fb.group({
        id_desarrolldaor: ['', Validators.required],
        nombre_desarrollador: ['', Validators.required],
        correo_desarrollador: ['', [Validators.required, Validators.email]],
        dni_desarrollador: ['', Validators.required],
      }),
      cotizacion_seccion: this.fb.group({
        fecha_cotizacion: this.valueFecha,
        subtotal: [0, Validators.required],
        descuento: [0, Validators.required],
        total: [0, Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.proyectoService.getEmpleados().subscribe((empleados) => {
      this.empleados = empleados;
    });
    this.proyectoService.getElementos().subscribe((elementos) => {
      this.elementos = elementos;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
    // Asegúrate de que los controles no son null antes de establecer los validadores
    const fechaInicioControl = this.formNuevo.get('proyecto_seccion.fecha_inicio');
    const fechaFinControl = this.formNuevo.get('proyecto_seccion.fecha_fin');

    if (fechaInicioControl && fechaFinControl) {
      fechaFinControl.addValidators(fechaFinValidator(fechaInicioControl));
      fechaFinControl.updateValueAndValidity();

    }
  }

  addElemento(event: MatAutocompleteSelectedEvent) {
    const elemento = this.elementos.find(elemento => elemento.nombre_elemento === event.option.viewValue);

    if (elemento && !this.selectedElementos.includes(elemento)) {
      this.selectedElementos = [...this.selectedElementos, elemento];
      this.subTotal.set(Number(this.subTotal()) + Number((elemento.costo || 0)));

      this.formNuevo.get('cotizacion_seccion')?.get('subtotal')?.patchValue(this.subTotal());
      this.total.set(this.subTotal() - this.descuento());
      this.formNuevo.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
      this.formNuevo.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
      this.myControl.reset();

      if (this.formNuevo.get('cotizacion_seccion')?.valid) {
        this.disable = false;
        this.previewPDF();
        this.buttonText.set('Crear Proyecto');
      } else {
        this.buttonText.set('Campos Invalidos');
      }
    } else {
      alert('Elemento ya seleccionado');
    }

    console.log(this.subTotal());
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.elementos
      .filter(elemento => elemento.nombre_elemento.toLowerCase().includes(filterValue))
      .map(elemento => elemento.nombre_elemento);
  }

  updateErrorMessage() {
    const errors = this.formNuevo.errors || {};
    if (errors['required']) {
      this.errorMessage = 'You must enter a value';
    } else if (errors['email']) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  changeValue(event: KeyboardEvent) {
    if (this.formNuevo.get('proyecto_seccion')?.valid && this.formNuevo.get('cliente_seccion')?.valid) {
      this.disable = false;
      this.buttonText.set('Siguiente');
    } else {
      this.disable = true;
      this.buttonText.set('Campos Invalidos');
    }
  }

  changeValueDescuento(event: KeyboardEvent) {
    const descuentoElement = event.target as HTMLInputElement;
    const descuentoValue = Number(descuentoElement.value);
    this.descuento.set(descuentoValue);

    const newTotal = this.subTotal() - this.descuento();
    this.total.set(newTotal);
    this.formNuevo.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
    this.previewPDF();
    console.log(this.total());
  }

  changeValueSelect(event: MatSelectChange) {
    const idEmpleado = event.value;
    //Empleado ya ccuenta con un proyecto

    this.proyectoService.getProyectos().subscribe((proyectos) => {


      const empleado_proyecto_pendiente = proyectos.find(proyecto => 
        proyecto.empleado.idEmpleado === idEmpleado && proyecto.estado.idEstado === 1
      ); 

      const empleado_proyecto_en_proceso = proyectos.find(proyecto =>
        proyecto.empleado.idEmpleado === idEmpleado && proyecto.estado.idEstado === 2
      );

      if(empleado_proyecto_pendiente || empleado_proyecto_en_proceso){
        alert('El empleado ya cuenta con un proyecto');
        this.formNuevo.get('desarrollador_seccion')?.reset();
      }else{
        this.loadEmpleado(idEmpleado);
      }
     
    });
  }

  loadEmpleado(idEmpleado: number) {
    this.proyectoService.getEmpleadoById(idEmpleado).subscribe((empleado) => {
      console.table(empleado);
      
      
      
      this.formNuevo.get('desarrollador_seccion')?.patchValue({
        id_desarrolldaor: empleado.idEmpleado,
        nombre_desarrollador: empleado.nombre_empleado,
        correo_desarrollador: empleado.correo_empleado,
        dni_desarrollador: empleado.dni_empleado,
      });
      
    });
  }

  nextSection() {
    if (this.visibleSeccionProyecto && this.formNuevo.get('proyecto_seccion')?.valid) {
      this.visibleSeccionProyecto = false;
      this.visibleSeccionCliente = true;
      this.previewPDF();
    } else if (this.visibleSeccionCliente && this.formNuevo.get('cliente_seccion')?.valid) {
      this.visibleSeccionCliente = false;
      this.visibleSeccionDesarrollador = true;
      this.previewPDF();
    } else if (this.visibleSeccionDesarrollador && this.formNuevo.get('desarrollador_seccion')?.valid) {
      this.visibleSeccionDesarrollador = false;
      this.visibleSeccionCotizacion = true;
      this.previewPDF();
    } else if (this.visibleSeccionCotizacion && this.formNuevo.get('cotizacion_seccion')?.valid) {
    this.registrarProyecto();

      
    }
  }

  backTo() {
    if (this.visibleSeccionCliente) {
      this.visibleSeccionCliente = false;
      this.visibleSeccionProyecto = true;
    } else if (this.visibleSeccionDesarrollador) {
      this.visibleSeccionDesarrollador = false;
      this.visibleSeccionCliente = true;
    } else if (this.visibleSeccionCotizacion) {
      this.visibleSeccionCotizacion = false;
      this.visibleSeccionDesarrollador = true;
    }
  }

  //previsualizar PDF:
  previewPDF() {
    const doc = new jsPDF();
    const proyecto = this.formNuevo.get('proyecto_seccion')?.value;
    const cliente = this.formNuevo.get('cliente_seccion')?.value;
    const desarrollador = this.formNuevo.get('desarrollador_seccion')?.value;
    const cotizacion = this.formNuevo.get('cotizacion_seccion')?.value;
    doc.setFontSize(16);
    doc.text("Información del Proyecto", 10, 10);
    doc.setFontSize(12);

    doc.text(`Nombre del Proyecto: ${proyecto.nombre_proyecto}`, 10, 20);
    doc.text(`Descripción del Proyecto: ${proyecto.descripcion}`, 10, 30);
    doc.text(`Fecha de Inicio: ${proyecto.fecha_inicio}`, 10, 40);
    doc.text(`Fecha de Fin: ${proyecto.fecha_fin}`, 10, 50);

    doc.text("Información del Cliente", 10, 60);

    doc.text(`Nombre del Cliente: ${cliente.nombre_cliente}`, 10, 70);
    doc.text(`Correo del Cliente: ${cliente.correo_cliente}`, 10, 80);
    doc.text(`Teléfono del Cliente: ${cliente.telefono_cliente}`, 10, 90);
    doc.text(`DNI del Cliente: ${cliente.dni_cliente}`, 10, 100);

    doc.text("Información del Desarrollador", 10, 110);

    doc.text(`Nombre del Desarrollador: ${desarrollador.nombre_desarrollador}`, 10, 120);
    doc.text(`Correo del Desarrollador: ${desarrollador.correo_desarrollador}`, 10, 130);
    doc.text(`DNI del Desarrollador: ${desarrollador.dni_desarrollador}`, 10, 140);

    doc.text("Información de la Cotización", 10, 150);

    doc.text(`Fecha de la Cotización: ${cotizacion.fecha}`, 10, 160);
    doc.text(`Subtotal: ${cotizacion.subtotal}`, 10, 170);
    doc.text(`Descuento: ${cotizacion.descuento}`, 10, 180);
    doc.text(`Total: ${cotizacion.total}`, 10, 190);

    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring'));
  }

  registrarProyecto() {
    if (this.formNuevo.valid) {
      // Obtener los datos del cliente
      const cliente = this.formNuevo.get('cliente_seccion')?.value;
      console.log('Datos enviados al servidor:', cliente);
  
      // Registrar el cliente
      this.proyectoService.registrarCliente(cliente).subscribe({
        next: (cliente) => {
          
          console.log('Cliente registrado:', cliente);
          
          // Obtener los datos del proyecto
          const proyecto = this.formNuevo.get('proyecto_seccion')?.value;
          const desarrollador = this.formNuevo.get('desarrollador_seccion')?.value;
          const cotizacion = this.formNuevo.get('cotizacion_seccion')?.value;
          const proyectoData = {
            ...proyecto,
            idCliente: cliente.idCliente, // Asegúrate de obtener este valor correctamente
            idEmpleado:desarrollador.id_desarrolldaor , // Asegúrate de obtener este valor correctamente
            idEstado: 1, // Asegúrate de obtener este valor correctamente
            fecha_inicio: proyecto.fecha_inicio.toISOString().slice(0, 19).replace('T', ' '), 
            fecha_fin: proyecto.fecha_fin.toISOString().slice(0, 19).replace('T', ' '),
            subtotal: cotizacion.subtotal,
            descuento: cotizacion.descuento,
            total: cotizacion.total,
            fecha_cotizacion: cotizacion.fecha_cotizacion
          };

          //registrar el proyecto
          this.proyectoService.registrarProyecto(proyectoData).subscribe({
            next: (response) => {
              console.log('Proyecto registrado exitosamente', response);

              //registrar la cotizacion
              const cotizacionData = {
                ...cotizacion,
                idProyecto: response.idProyecto,
                idEstado: 1,
                idEmpleado: desarrollador.id_desarrolldaor,
                idCliente: cliente.idCliente,
                

                };

              
              this.cotizacionService.registrarCotizacion(cotizacionData).subscribe({
                next: (response) => {
                  console.log('Cotización registrada exitosamente', response);

                  //registrar los elementos de la cotización
                  this.selectedElementos.forEach(elemento=>{
                      const elemento_cotizacionData={
                        idCotizacion: response.idCotizacion,
                        idElemento: Number(elemento.idElemento)
                      };

                      this.cotizacionService.registrarElemento_cotizacion(elemento_cotizacionData as unknown as Elementos).subscribe({
                        next: (response) => {
                          console.log('Elemento registrado exitosamente', response);
                          this.router.navigate(['/proyectos']);
                         
                        },
                        error: (error) => {
                          console.error('Error al registrar el elemento', error);
                        }
                      });
                        
                  });
                    

                },
                error: (error) => {
                  console.error('Error al registrar la cotización', error);
                  if (error.status === 422) {
                    console.error('Errores de validación:', error.error.errors);
                  }
                }
            
              });
              },

            error: (error) => {
              console.error('Error al registrar el proyecto', error);
              if (error.status === 422) {
                console.error('Errores de validación:', error.error.errors);
              }
            }
          });
          
        },
        error: (error) => {
          console.error('Error al registrar el cliente', error);
          if (error.status === 422) {
            console.error('Errores de validación:', error.error.errors);
          }
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  

  }

  deleteElemento(elemento: Elementos) {
    this.selectedElementos = this.selectedElementos.filter(e => e.idElemento !== elemento.idElemento);
    console.log(this.selectedElementos);
    this.subTotal.set(this.subTotal() - elemento.costo);
    this.total.set(this.total() - elemento.costo);
    this.formNuevo.get('cotizacion_seccion')?.get('subtotal')?.patchValue(this.subTotal());
    this.formNuevo.get('cotizacion_seccion')?.get('descuento')?.patchValue(this.descuento());
    this.formNuevo.get('cotizacion_seccion')?.get('total')?.patchValue(this.total());
    this.formNuevo.get('cotizacion_seccion')?.get('elementos')?.patchValue(this.selectedElementos);
    this.previewPDF();
  }
}
