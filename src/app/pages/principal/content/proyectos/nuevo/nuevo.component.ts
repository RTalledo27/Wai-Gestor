import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-nuevo',
  standalone: true,

imports: [

  HeaderComponent, SidebarComponent,NgStyle, ReactiveFormsModule, MatIconModule, MatInputModule, MatFormFieldModule,RouterOutlet],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})


export class NuevoComponent {

  // Inicializa formNuevo aquí

  sidebarStyles = {
    'display': 'flex', // Importante para flexbox
    'flex-direction': 'row', // Horizontal
    'justify-content':'center',// Alinea los elementos verticalmente
    'width': '100%',
    'height':'auto' // Ajusta el ancho según tus necesidades
    // ... otros estilos que quieras aplicar
  };

 

}
