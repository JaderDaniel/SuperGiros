import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Routes
import { routes } from './app/app.routes';

// Interceptors
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './app/services/auth.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Interceptor funcional de autenticación
const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtener token de autenticación
  const token = authService.getToken();
  
  // Clonar la request y agregar headers de autenticación
  let authRequest = req;
  
  if (token) {
    authRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } else {
    const basicAuth = btoa('demo_user:demo_password');
    authRequest = req.clone({
      setHeaders: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Agregar headers adicionales
  authRequest = authRequest.clone({
    setHeaders: {
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error intercepted:', error);
      
      if (error.status === 401) {
        console.warn('Token expirado o inválido. Redirigiendo al login...');
        authService.logout();
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};

// Interceptor funcional de logging
const loggingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`🚀 HTTP ${req.method} Request to ${req.url} started`);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      console.error(`❌ HTTP ${req.method} Request to ${req.url} failed after ${duration}ms:`, error);
      return throwError(() => error);
    })
  );
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class App {
  title = 'Comercializadora del Atlántico - Catálogo Empresarial';
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptorFn, loggingInterceptorFn])
    )
  ]
}).catch(err => console.error('Error starting application:', err));