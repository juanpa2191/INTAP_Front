import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActividadesService } from '../services/actividades.service';
import { TiemposService } from '../services/tiempos.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Actividades</h2>
        </div>
        <div class="col text-end">
          <button class="btn btn-primary" (click)="abrirModalActividad()">
            Nueva Actividad
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let actividad of actividades">
                      <td>{{ actividad.descripcion }}</td>
                      <td>
                        <span class="badge bg-{{ actividad.estado === 'Activo' ? 'success' : 'danger' }}">
                          {{ actividad.estado }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-info me-2" (click)="abrirModalTiempo(actividad.id)">
                          Registrar Tiempo
                        </button>
                        <button class="btn btn-sm btn-danger" (click)="eliminarActividad(actividad.id)">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Nueva Actividad -->
      <div class="modal fade" id="modalActividad" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nueva Actividad</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="actividadForm" (ngSubmit)="guardarActividad()">
                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <input type="text" class="form-control" id="descripcion" formControlName="descripcion" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" formControlName="estado" required>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Registrar Tiempo -->
      <div class="modal fade" id="modalTiempo" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registrar Tiempo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="tiempoForm" (ngSubmit)="guardarTiempo()">
                <div class="mb-3">
                  <label for="fecha" class="form-label">Fecha</label>
                  <input type="date" class="form-control" id="fecha" formControlName="fecha" required>
                </div>
                <div class="mb-3">
                  <label for="horas" class="form-label">Horas</label>
                  <input type="number" class="form-control" id="horas" formControlName="horas" required min="0" max="24">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .container {
      padding: 20px;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .badge {
      font-size: 0.85rem;
    }
    .modal-content {
      border-radius: 8px;
    }
    .modal-header {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .modal-footer {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class ActividadesComponent implements OnInit {
  actividades: any[] = [];
  actividadForm: FormGroup;
  tiempoForm: FormGroup;
  actividadId: number | null = null;
  tiempoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private actividadesService: ActividadesService,
    private tiemposService: TiemposService,
    private router: Router,
    private authService: AuthService
  ) {
    this.actividadForm = this.fb.group({
      descripcion: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });

    this.tiempoForm = this.fb.group({
      fecha: ['', Validators.required],
      horas: ['', [Validators.required, Validators.min(0), Validators.max(24)]]
    });
  }

  ngOnInit() {
    this.cargarActividades();
  }

  cargarActividades() {
    this.actividadesService.getActividades().subscribe({
      next: (response) => {
        this.actividades = response;
      },
      error: (error: any) => {
        console.error('Error al cargar actividades:', error);
      }
    });
  }

  abrirModalActividad() {
    this.actividadId = null;
    this.actividadForm.reset({
      estado: 'Activo'
    });
    const modal = document.getElementById('modalActividad');
    if (modal) {
      // Usar Bootstrap vía npm
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  guardarActividad() {
    if (this.actividadForm.valid) {
      const actividad = this.actividadForm.value;
      
      this.actividadesService.crearActividad(actividad.descripcion).subscribe({
        next: (response) => {
          const modal = document.getElementById('modalActividad');
          if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
              bsModal.hide();
            }
          }
          this.cargarActividades();
        },
        error: (error: any) => {
          console.error('Error al crear actividad:', error);
        }
      });
    }
  }

  abrirModalTiempo(actividadId: number) {
    this.tiempoId = null;
    this.actividadId = actividadId;
    this.tiempoForm.reset();
    const modal = document.getElementById('modalTiempo');
    if (modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  guardarTiempo() {
    if (this.tiempoForm.valid && this.actividadId !== null) {
      const tiempo = this.tiempoForm.value;
      
      this.tiemposService.registrarTiempo({
        actividadId: this.actividadId,
        fecha: tiempo.fecha,
        horas: tiempo.horas
      }).subscribe({
        next: (response) => {
          const modal = document.getElementById('modalTiempo');
          if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
              bsModal.hide();
            }
          }
          this.cargarActividades();
        },
        error: (error: any) => {
          console.error('Error al crear tiempo:', error);
        }
      });
    }
  }

  eliminarActividad(actividadId: number) {
    if (confirm('¿Está seguro de eliminar esta actividad?')) {
      this.actividadesService.eliminarActividad(actividadId).subscribe({
        next: () => {
          this.cargarActividades();
        },
        error: (error: any) => {
          console.error('Error al eliminar actividad:', error);
        }
      });
    }
  }
}
