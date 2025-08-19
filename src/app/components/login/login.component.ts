import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <!-- Background decorative elements -->
      <div class="background-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>

      <div class="login-wrapper fade-in">
        <!-- Company branding section -->
        <div class="company-header">
          <div class="company-logo">
            <mat-icon class="logo-icon">corporate_fare</mat-icon>
          </div>
          <h1 class="company-title">Comercializadora del Atlántico</h1>
          <p class="company-subtitle">Portal Empresarial de Productos y Servicios</p>
          <div class="header-divider"></div>
        </div>
        
        <!-- Main login card -->
        <div class="login-card-container">
          <mat-card class="login-card modern-card">
            <div class="card-header">
              <div class="login-icon-wrapper">
                <mat-icon class="login-icon">lock_person</mat-icon>
              </div>
              <h2 class="login-title">Bienvenido</h2>
              <p class="login-subtitle">Ingrese sus credenciales para continuar</p>
            </div>
          
            <mat-card-content class="card-content">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Usuario</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="username"
                  placeholder="Ingrese su usuario"
                  [class.mat-form-field-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                >
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                  El usuario es obligatorio
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contraseña</mat-label>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Ingrese su contraseña"
                  [class.mat-form-field-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button
                  mat-icon-button
                  matSuffix
                  (click)="hidePassword = !hidePassword"
                  type="button"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword"
                >
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Ingresa la coontraseña
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
              </mat-form-field>

              <div class="demo-credentials modern-demo">
                <div class="demo-header">
                  <mat-icon>info_outline</mat-icon>
                  <span>Credenciales de Demostración</span>
                </div>
                <div class="demo-content">
                  <div class="credential-item">
                    <span class="credential-label">Usuario:</span>
                    <code class="credential-value">mor_2314</code>
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">Contraseña:</span>
                    <code class="credential-value">83r5^_</code>
                  </div>
                </div>
                <button
                  mat-stroked-button
                  type="button"
                  color="primary"
                  (click)="fillDemoCredentials()"
                  class="demo-button"
                >
                  <mat-icon>auto_fix_high</mat-icon>
                  Usar Credenciales Demo
                </button>
              </div>

              <div class="form-actions">
                <button
                  mat-flat-button
                  color="primary"
                  type="submit"
                  [disabled]="loginForm.invalid || isLoading"
                  class="login-button modern-button"
                >
                  <div class="button-content">
                    <mat-spinner *ngIf="isLoading" diameter="20" class="button-spinner"></mat-spinner>
                    <mat-icon *ngIf="!isLoading" class="button-icon">login</mat-icon>
                    <span class="button-text">{{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}}</span>
                  </div>
                </button>
              </div>
            </form>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Feature highlights -->
        <div class="features-section">
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <mat-icon>security</mat-icon>
              </div>
              <div class="feature-content">
                <h4>Autenticación Segura</h4>
                <p>Sistema de tokens Bearer para máxima seguridad</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <mat-icon>cloud_sync</mat-icon>
              </div>
              <div class="feature-content">
                <h4>APIs REST</h4>
                <p>Integración completa con servicios externos</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <mat-icon>image</mat-icon>
              </div>
              <div class="feature-content">
                <h4>Imágenes Base64</h4>
                <p>Almacenamiento persistente y optimizado</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <mat-icon>auto_stories</mat-icon>
              </div>
              <div class="feature-content">
                <h4>Catálogo Flipbook</h4>
                <p>Experiencia interactiva e inmersiva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* Background decorative elements */
    .background-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: 2s;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: -75px;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .login-wrapper {
      width: 100%;
      max-width: 450px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      position: relative;
      z-index: 1;
    }

    /* Company header */
    .company-header {
      text-align: center;
      color: white;
      margin-bottom: 20px;
    }

    .company-logo {
      margin-bottom: 15px;
    }

    .logo-icon {
      font-size: 3.5rem;
      width: 3.5rem;
      height: 3.5rem;
      color: white;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    }

    .company-title {
      font-size: 2.2rem;
      font-weight: 300;
      margin: 15px 0 8px 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      letter-spacing: -0.02em;
    }

    .company-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0 0 20px 0;
      font-weight: 300;
    }

    .header-divider {
      width: 60px;
      height: 3px;
      background: rgba(255,255,255,0.6);
      margin: 0 auto;
      border-radius: 2px;
    }

    /* Login card */
    .login-card-container {
      perspective: 1000px;
    }

    .modern-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 
        0 20px 40px rgba(0,0,0,0.15),
        0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .modern-card:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 30px 60px rgba(0,0,0,0.2),
        0 1px 3px rgba(0,0,0,0.1);
    }

    .card-header {
      text-align: center;
      padding: 40px 40px 20px 40px;
      background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .login-icon-wrapper {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: white;
    }

    .login-title {
      margin: 0 0 8px 0;
      font-size: 1.8rem;
      font-weight: 500;
      color: #333;
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
      font-weight: 300;
    }

    .card-content {
      padding: 30px 40px 40px 40px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .full-width {
      width: 100%;
    }

    .mat-mdc-form-field {
      font-size: 0.95rem;
    }

    .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .mat-mdc-form-field-focus-overlay {
      border-radius: 12px;
    }

    /* Demo credentials */
    .modern-demo {
      background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin: 10px 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;
      color: #4a5568;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .demo-header mat-icon {
      color: #667eea;
    }

    .demo-content {
      margin-bottom: 15px;
    }

    .credential-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px 0;
    }

    .credential-label {
      color: #4a5568;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .credential-value {
      background: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #2d3748;
      border: 2px solid rgba(102, 126, 234, 0.2);
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .demo-button {
      width: 100%;
      border-radius: 10px;
      text-transform: none;
      font-weight: 500;
    }

    /* Login button */
    .form-actions {
      margin-top: 10px;
    }

    .modern-button {
      width: 100%;
      height: 50px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      text-transform: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      letter-spacing: 0.02em;
    }

    .modern-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }

    .modern-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .button-spinner {
      color: white;
    }

    .button-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .button-text {
      font-size: 1rem;
    }

    /* Features section */
    .features-section {
      margin-top: 20px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .feature-item {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 20px 15px;
      text-align: center;
      color: #333;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .feature-icon {
      margin-bottom: 10px;
    }

    .feature-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #667eea;
    }

    .feature-content h4 {
      margin: 0 0 5px 0;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: #333;
    }

    .feature-content p {
      margin: 0;
      font-size: 0.8rem;
      color: #666;
      line-height: 1.3;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .login-container {
        padding: 15px;
      }

      .login-wrapper {
        max-width: 100%;
        gap: 20px;
      }

      .company-title {
        font-size: 1.8rem;
      }

      .company-subtitle {
        font-size: 1rem;
      }

      .card-header,
      .card-content {
        padding: 25px 25px;
      }

      .login-title {
        font-size: 1.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .feature-item {
        padding: 15px 12px;
      }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }

      .company-title {
        font-size: 1.6rem;
      }

      .card-header,
      .card-content {
        padding: 20px;
      }

      .login-form {
        gap: 20px;
      }

      .modern-button {
        height: 45px;
        font-size: 0.95rem;
      }
    }

    /* Animation improvements */
    .fade-in {
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Focus states */
    .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-form-field-outline-thick {
      color: #667eea;
    }

    .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-floating-label {
      color: #667eea;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al catálogo
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/catalog']);
    }
  }

  /**
   * Llenar credenciales de demo
   */
  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      username: 'mor_2314',
      password: '83r5^_'
    });
  }

  /**
   * Manejar envío del formulario
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const credentials: LoginCredentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/catalog']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error de login:', error);
          this.snackBar.open(
            'Error al iniciar sesión. Verifique sus credenciales.',
            'Cerrar',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}