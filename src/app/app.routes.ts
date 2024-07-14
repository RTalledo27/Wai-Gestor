import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { HomeComponent } from './pages/principal/content/home/home.component';
import { ProyectosComponent } from './pages/principal/content/proyectos/proyectos.component';
import { DesarrolladoresComponent } from './pages/principal/content/desarrolladores/desarrolladores.component';
import { CotizacionesComponent } from './pages/principal/content/cotizaciones/cotizaciones.component';
import { NotFoundComponent } from './pages/principal/404/not-found/not-found.component';
import { NuevoComponent } from './pages/principal/content/proyectos/nuevo/nuevo.component';
import { FormNuevoComponent } from './pages/principal/content/proyectos/nuevo/form-nuevo/form-nuevo.component';
import { LoginComponent } from './pages/principal/Auth/login/login.component';


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

  {
    path:'proyectos/nuevo',
    component: NuevoComponent,
    children: [
      {
        path: '',
        component: FormNuevoComponent
      }
    ]
  },
  
  {
    path:'login',
    component: LoginComponent
  },


  {
    path: '**',
    component: NotFoundComponent
  },
   
 
 
];
