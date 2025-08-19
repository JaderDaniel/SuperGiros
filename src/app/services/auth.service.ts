import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginCredentials, AuthResponse, User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://fakestoreapi.com';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay token almacenado al inicializar el servicio
    this.checkStoredAuth();
  }

  /**
   * Verificar autenticación almacenada en localStorage
   */
  private checkStoredAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearStoredAuth();
      }
    }
  }

  /**
   * Iniciar sesión con credenciales
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            // Almacenar token y datos de usuario
            localStorage.setItem(this.TOKEN_KEY, response.token);
            
            // Simular datos de usuario (FakeStore API no devuelve user en login)
            const mockUser: User = {
              id: 1,
              email: credentials.username,
              username: credentials.username,
              password: '',
              name: {
                firstname: 'Usuario',
                lastname: 'Demo'
              },
              address: {
                city: 'Barranquilla',
                street: 'Calle Ejemplo',
                number: 123,
                zipcode: '080001',
                geolocation: {
                  lat: '10.9639',
                  long: '-74.7964'
                }
              },
              phone: '300-123-4567'
            };
            
            localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(mockUser);
          }
        }),
        catchError(error => {
          console.error('Error de autenticación:', error);
          // Simular login exitoso para demo (FakeStore API a veces falla)
          if (credentials.username === 'mor_2314' && credentials.password === '83r5^_') {
            const mockResponse: AuthResponse = {
              token: 'demo_token_' + Date.now()
            };
            
            localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
            const mockUser: User = {
              id: 1,
              email: credentials.username,
              username: credentials.username,
              password: '',
              name: {
                firstname: 'Usuario',
                lastname: 'Demo'
              },
              address: {
                city: 'Barranquilla',
                street: 'Calle Ejemplo',
                number: 123,
                zipcode: '080001',
                geolocation: {
                  lat: '10.9639',
                  long: '-74.7964'
                }
              },
              phone: '300-123-4567'
            };
            
            localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(mockUser);
            
            return of(mockResponse);
          }
          throw error;
        })
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.clearStoredAuth();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Limpiar datos de autenticación almacenados
   */
  private clearStoredAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Obtener token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Simular registro de usuario (para demo)
   */
  register(userData: any): Observable<AuthResponse> {
    // En una aplicación real, esto haría una petición POST al endpoint de registro
    return of({
      token: 'demo_token_' + Date.now()
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const mockUser: User = {
          id: Date.now(),
          email: userData.email,
          username: userData.username,
          password: '',
          name: {
            firstname: userData.firstname || 'Nuevo',
            lastname: userData.lastname || 'Usuario'
          },
          address: {
            city: 'Barranquilla',
            street: 'Calle Nueva',
            number: 456,
            zipcode: '080001',
            geolocation: {
              lat: '10.9639',
              long: '-74.7964'
            }
          },
          phone: userData.phone || '300-000-0000'
        };
        
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(mockUser);
      })
    );
  }
}