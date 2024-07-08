import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ProyectoService } from '../../../services/proyecto.service';
import { NgForOf, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider'; // Add this import statement

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, CommonModule, MatProgressSpinnerModule, MatCardModule, MatRadioModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  //PARTE DE MAT PROGRESS COTIZACIONES:
    color: ThemePalette = 'primary';
    mode: ProgressSpinnerMode = 'determinate';
    valuePendiente = 90;
    valueCurso = 70;
    valueCulminado = 30;
    valueCancelado = 30;
  //

  private proyecto = inject(ProyectoService);
  visible = signal(true);

  total_proyectos = signal(0.0);

  proyectos_pendiente = signal(0.0);
  proyectos_en_curso = signal(0.0);
  proyectos_cancelados = signal(0.0);
  proyectos_culminados = signal(0.0);

  porcentaje_cancelados = signal(0.0);
  porcentaje_culminados = signal(0.0);
  porcentaje_en_curso = signal(0.0);
  porcentaje_pendiente = signal(0.0);

  desarolladores_proyectos_culminados: any = signal([]);
  totalIngresos = signal(0.0);
  ingresos_pendientes = signal(0.0);
  ingresos_proyectos_en_curso = signal(0.0);
  ingresos_proyectos_culminados = signal(0.0);
  ingresos_proyectos_cancelados = signal(0.0);



  ngOnInit(): void {
   try {
    this.proyecto.getInfoDash().subscribe({
      next: (data: any) => {
        if (data ) { 
          //this.proyectos_culminados.set(data.empleado);
          //TOTAL PROYECTOS PARA CALCULO DE PORCENTAJES SEGUN ESTADO
          this.total_proyectos.set(data.total_proyectos);

          //TOTAL PROYECTOS SEGUN ESTADO
          this.proyectos_pendiente.set(data.proyectos_pendiente);
          this.proyectos_en_curso.set(data.proyectos_en_curso);
          this.proyectos_cancelados.set(data.proyectos_cancelados);
          this.proyectos_culminados.set(data.proyectos_culminados);
          this.desarolladores_proyectos_culminados.set(data.desarolladores_proyectos_culminados);
          //CALCULO DE PORCENTAJES POR ESTADO:
          this.calcularPorcentajes();

          //* VALORES OBTENIDOS ENVIADOS A VARIABLES LOCALES PARA CALCULO DE PORCENTAJES DE INGRESOS
          this.ingresos_pendientes.set(data.ingresos_proyectos_pendiente);
          this.ingresos_proyectos_en_curso.set(data.ingresos_proyectos_en_curso);
          this.ingresos_proyectos_culminados.set(data.ingresos_proyectos_culminados);
          this.ingresos_proyectos_cancelados.set(data.ingresos_proyectos_cancelados);
          this.totalIngresos.set(Number(this.ingresos_pendientes()) + Number(this.ingresos_proyectos_culminados()) +Number(this.ingresos_proyectos_en_curso()) + Number(this.ingresos_proyectos_cancelados()));
          
          console.log(this.totalIngresos());
          console.log(data.desarolladores_proyectos_culminados);
          this.visible.set(false);
          this.porcentajeIngresos();
          
          
        } else {
          console.warn("The API response doesn't contain a 'nombre' property or the data is empty.");
        }
      },
      
      
    });
   } catch (error) {
  
      console.error("Error fetching developer details:", error);
      // Handle the error appropriately, e.g., display an error message to the user.
    
   }
    
  }


  calcularPorcentajes() {
    this.porcentaje_cancelados.set((this.proyectos_cancelados() * 100) / this.total_proyectos());
    this.porcentaje_pendiente.set((this.proyectos_pendiente() * 100) / this.total_proyectos());
    this.porcentaje_culminados.set((this.proyectos_culminados() * 100) / this.total_proyectos());
    this.porcentaje_en_curso.set((this.proyectos_en_curso() * 100) / this.total_proyectos());
  }


  porcentajeIngresos(){
    this.valuePendiente = (this.ingresos_pendientes() * 100) / this.totalIngresos();
    this.valueCurso = (this.ingresos_proyectos_en_curso() * 100) / this.totalIngresos();
    this.valueCulminado = (this.ingresos_proyectos_culminados() * 100) / this.totalIngresos();
    this.valueCancelado = (this.ingresos_proyectos_cancelados() * 100) / this.totalIngresos();
  }

}
