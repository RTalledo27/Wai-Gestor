import { Component, inject, signal } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { Empleados } from '../../models/empleados';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,MatIcon,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  public loggedIn = signal(false);
  //empleados: Empleados[] = [];
  nombre = signal('');

  private proyecto = inject(ProyectoService);
  isLoading = signal(true);

  ngOnInit(): void {
    this.authStatus();
    this.authService.authStatus.subscribe((value) => {
      this.loggedIn.set(value);
    });

    try {
      this.loginService.dataLogin().subscribe({
        next: (data: any) => {
          if (data) {
            this.nombre.set(data.nombre_empleado);
            console.log(data);
          } else {
            console.warn(
              "The API response doesn't contain a 'nombre' property or the data is empty."
            );
          }
        },
        error: (error: any) => {
          console.error('Error fetching developer details:', error);
          // Handle the error appropriately, e.g., display an error message to the user.
        },
      });
    } catch (error) {
      console.log('Error fetching developer details:', error);
    }
  
  }


  showLogoutButton = false;

  showLogout() {
    this.showLogoutButton = true;
  }

  hideLogout() {
    this.showLogoutButton = false;
  }


  
  logout() {
    this.authService.logout();
  }


  authStatus(){
    this.authService.authStatus.subscribe(isLoggedIn => {
      if(!isLoggedIn){
        this.router.navigate(['/login']);
      }
    });
  }

}
