import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="usuario" class="form-label">Usuario</label>
            <input type="text" class="form-control" id="usuario" formControlName="usuario" required>
            <div *ngIf="loginForm.get('usuario')?.invalid && loginForm.get('usuario')?.touched" class="text-danger">
              El usuario es requerido
            </div>
          </div>
          <div class="mb-3">
            <label for="contrasena" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="contrasena" formControlName="contrasena" required>
            <div *ngIf="loginForm.get('contrasena')?.invalid && loginForm.get('contrasena')?.touched" class="text-danger">
              La contraseña es requerida
            </div>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary w-100" [disabled]="loginForm.invalid">
              Ingresar
            </button>
          </div>
          <div *ngIf="error" class="alert alert-danger">
            {{error}}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    .login-box {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .login-box h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    .form-control {
      border-radius: 4px;
      padding: 0.75rem;
    }
    .btn-primary {
      padding: 0.75rem;
      font-weight: 500;
    }
    .alert {
      margin-top: 1rem;
      border-radius: 4px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Limpiar el token si existe
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;
      
      this.authService.login(usuario, contrasena).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/actividades']);
        },
        error: (error: any) => {
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
    }
  }
}
