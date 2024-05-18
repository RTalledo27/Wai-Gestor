import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { HomeComponent } from './pages/principal/content/home/home.component';
import { ProyectosComponent } from './pages/principal/content/proyectos/proyectos.component';
import { DesarrolladoresComponent } from './pages/principal/content/desarrolladores/desarrolladores.component';
import { CotizacionesComponent } from './pages/principal/content/cotizaciones/cotizaciones.component';



export const routes: Routes = [

  {

    path: '',
    component: PrincipalComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'proyectos',
        component: ProyectosComponent
      },
      {
        path: 'cotizaciones',
        component: CotizacionesComponent
      },
      {
        path:'desarrolladores',
        component: DesarrolladoresComponent
      }
    
    ]


  },
 
];
