import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors,  } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptorInterceptor } from './pages/services/interceptors/auth-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptorInterceptor]), ), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), 


  ]
};
