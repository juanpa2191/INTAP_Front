import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TiemposService {
  private apiUrl = 'https://localhost:7157/api/actividades';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTiempos(): Observable<any> {
    const userId = 1; 
    return this.http.get(`${this.apiUrl}/${userId}/Tiempos`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getTiemposPorActividad(actividadId: number): Observable<any> {
    const userId = 1; 
    return this.http.get(`${this.apiUrl}/${userId}/actividad/${actividadId}/Tiempos`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  registrarTiempo(tiempo: any): Observable<any> {
    const userId = 1; 
    return this.http.post(`${this.apiUrl}/${userId}/Tiempos`, tiempo, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  actualizarTiempo(id: number, tiempo: any): Observable<any> {
    const userId = 1; 
    return this.http.put(`${this.apiUrl}/${userId}/Tiempos/${id}`, tiempo, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  eliminarTiempo(id: number): Observable<any> {
    const userId = 1; 
    return this.http.delete(`${this.apiUrl}/${userId}/Tiempos/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
