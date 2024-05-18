import { Component, inject, signal } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { Empleados } from '../../models/empleados';
import { RouterLink } from '@angular/router';
RouterLink
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  //empleados: Empleados[] = [];
  nombre = signal('nombre');

  private proyecto = inject(ProyectoService);
 
   
 



  
  ngOnInit(): void {
   
    this.proyecto.getInfoDash().subscribe({
      next: (data: any) => {
        if (data ) { 
          this.nombre.set(data.empleado);
          console.log(data); 
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


 
 
  }





  
   
    



