import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private apiUrl = 'https://localhost:7157/api/Actividades';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getActividades(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  crearActividad(descripcion: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      descripcion
    }, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  eliminarActividad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
