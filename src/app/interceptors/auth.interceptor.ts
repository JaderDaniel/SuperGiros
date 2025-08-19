import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener token de autenticación
    const token = this.authService.getToken();
    
    // Clonar la request y agregar headers de autenticación
    let authRequest = request;
    
    if (token) {
      // Agregar Bearer Token para autenticación
      authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } else {
      // Para APIs que requieren Basic Auth (ejemplo)
      // En este caso usamos credenciales demo
      const basicAuth = btoa('demo_user:demo_password');
      authRequest = request.clone({
        setHeaders: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    // Agregar headers adicionales para CORS y seguridad
    authRequest = authRequest.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    console.log('HTTP Request intercepted:', {
      url: authRequest.url,
      method: authRequest.method,
      headers: authRequest.headers.keys().map(key => ({
        key,
        value: key.toLowerCase().includes('authorization') ? '[HIDDEN]' : authRequest.headers.get(key)
      }))
    });

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error intercepted:', error);
        
        // Manejar errores de autenticación
        if (error.status === 401) {
          console.warn('Token expirado o inválido. Redirigiendo al login...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        
        // Manejar otros errores HTTP
        if (error.status === 403) {
          console.warn('Acceso prohibido. Permisos insuficientes.');
        }
        
        if (error.status === 0) {
          console.warn('Error de conexión. Verificar conectividad a internet.');
        }
        
        if (error.status >= 500) {
          console.error('Error del servidor. Intente más tarde.');
        }

        return throwError(() => error);
      })
    );
  }
}

/**
 * Interceptor adicional para simular latencia de red (útil para testing)
 */
@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Solo aplicar delay en desarrollo
    if (!request.url.includes('localhost') && !request.url.includes('127.0.0.1')) {
      // Simular latencia de red para APIs externas
      return new Observable(observer => {
        setTimeout(() => {
          next.handle(request).subscribe(observer);
        }, Math.random() * 500 + 200); // Delay entre 200-700ms
      });
    }
    
    return next.handle(request);
  }
}

/**
 * Interceptor para logging de requests (útil para debugging)
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime = Date.now();
    
    console.log(`🚀 HTTP ${request.method} Request to ${request.url} started`);
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;
        console.error(`❌ HTTP ${request.method} Request to ${request.url} failed after ${duration}ms:`, error);
        return throwError(() => error);
      })
    );
  }
}