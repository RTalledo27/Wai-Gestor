import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ProyectoService } from '../../../services/proyecto.service';
import { NgForOf, CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private proyecto = inject(ProyectoService);

  total_proyectos = signal(0.0);
  proyectos_en_curso = signal(0.0);
  proyectos_cancelados = signal(0.0);
  proyectos_culminados = signal(0.0);
  porcentaje_cancelados = signal(0.0);
  porcentaje_culminados = signal(0.0);
  porcetaje_en_curso = signal(0.0);
  desarolladores_proyectos_culminados: any = signal([]);


  ngOnInit(): void {
   
    this.proyecto.getInfoDash().subscribe({
      next: (data: any) => {
        if (data ) { 
          //this.proyectos_culminados.set(data.empleado);
          this.total_proyectos.set(data.count_proyectos);
          this.proyectos_en_curso.set(data.proyectos_curso);
          this.proyectos_cancelados.set(data.proyectos_cancelados);
          this.proyectos_culminados.set(data.proyectos_culminados);
          this.desarolladores_proyectos_culminados.set(data.desarolladores_proyectos_culminados);
          this.calcularPorcentajes();
          console.log(data.desarolladores_proyectos_culminados);
        } else {
          console.warn("The API response doesn't contain a 'nombre' property or the data is empty.");
        }
      },
      error: (error: any) => {
        console.error("Error fetching developer details:", error);
        // Handle the error appropriately, e.g., display an error message to the user.
      }
    });
  }


  calcularPorcentajes() {
    this.porcentaje_cancelados.set((this.proyectos_cancelados() * 100) / this.total_proyectos());
    
    this.porcentaje_culminados.set((this.proyectos_culminados() * 100) / this.total_proyectos());
    this.porcetaje_en_curso.set((this.proyectos_en_curso() * 100) / this.total_proyectos());

    



  }

}
