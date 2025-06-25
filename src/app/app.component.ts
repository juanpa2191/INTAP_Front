import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  providers: [provideAnimations()],
  template: `
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div class="container-fluid">
          <span class="navbar-brand">INTAP App</span>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/login']" *ngIf="!authService.isLoggedIn()">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/actividades']" *ngIf="authService.isLoggedIn()">Actividades</a>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <button class="btn btn-outline-danger" (click)="authService.logout()" *ngIf="authService.isLoggedIn()">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `, 
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .navbar {
      margin-bottom: 2rem;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
