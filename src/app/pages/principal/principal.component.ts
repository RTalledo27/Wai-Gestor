import { Component, inject, output } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProyectoService } from '../services/proyecto.service';
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

 
}
