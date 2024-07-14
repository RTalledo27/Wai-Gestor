import { Component, inject, output } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterModule } from '@angular/router';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProyectoService } from '../services/proyecto.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authStatus();
    
  }


  authStatus(){
    this.authService.authStatus.subscribe(isLoggedIn => {
      if(!isLoggedIn){
        this.router.navigate(['/login']);
      }
    });
  }
 
}
