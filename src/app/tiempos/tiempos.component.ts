import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TiemposService } from '../services/tiempos.service';
import { ActividadesService } from '../services/actividades.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tiempos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Tiempos Registrados</h2>
        </div>
        <div class="col text-end">
          <button class="btn btn-primary" (click)="abrirModalTiempo()">
            <i class="bi bi-clock"></i> Registrar Tiempo
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Actividad</th>
                      <th>Fecha</th>
                      <th>Horas</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let tiempo of tiempos" [class.table-success]="tiempo.estado === 'Activo'">
                      <td>{{ tiempo.actividad.descripcion }}</td>
                      <td>{{ tiempo.fecha | date:'dd/MM/yyyy' }}</td>
                      <td>{{ tiempo.horas }} horas</td>
                      <td>
                        <span class="badge bg-{{ tiempo.estado === 'Activo' ? 'success' : 'danger' }}">
                          {{ tiempo.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-info" (click)="abrirModalEditar(tiempo)" title="Editar">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-danger" (click)="eliminarTiempo(tiempo.id)" title="Eliminar">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para registrar/editar tiempo -->
      <div class="modal fade" id="modalTiempo" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ tiempoId ? 'Editar' : 'Registrar' }} Tiempo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="tiempoForm" (ngSubmit)="guardarTiempo()" class="needs-validation" novalidate>
                <div class="mb-3">
                  <label for="actividad" class="form-label">Actividad</label>
                  <select class="form-select" id="actividad" formControlName="actividadId" required>
                    <option value="">Seleccione una actividad</option>
                    <option *ngFor="let actividad of actividades" [value]="actividad.id">
                      {{ actividad.descripcion }}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="tiempoForm.get('actividadId')?.touched && tiempoForm.get('actividadId')?.invalid">
                    Selecciona una actividad
                  </div>
                </div>
                <div class="mb-3">
                  <label for="fecha" class="form-label">Fecha</label>
                  <input type="date" class="form-control" id="fecha" formControlName="fecha" required>
                  <div class="invalid-feedback" *ngIf="tiempoForm.get('fecha')?.touched && tiempoForm.get('fecha')?.invalid">
                    La fecha es requerida
                  </div>
                </div>
                <div class="mb-3">
                  <label for="horas" class="form-label">Horas</label>
                  <input type="number" class="form-control" id="horas" formControlName="horas" required min="0.1" step="0.25">
                  <div class="invalid-feedback" *ngIf="tiempoForm.get('horas')?.touched && tiempoForm.get('horas')?.invalid">
                    Las horas deben ser al menos 0.25 horas
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary" [disabled]="tiempoForm.invalid">
                    <i class="bi bi-save"></i> {{ tiempoId ? 'Actualizar' : 'Registrar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .table-hover tbody tr:hover {
      background-color: rgba(0, 123, 255, 0.1);
    }
    .table-success {
      background-color: rgba(40, 167, 69, 0.1);
    }
    .btn-group button {
      margin-right: 5px;
    }
  `]
})
export class TiemposComponent implements OnInit {
  tiempos: any[] = [];
  actividades: any[] = [];
  modal: any;
  tiempoForm: FormGroup;
  tiempoId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tiemposService: TiemposService,
    private actividadesService: ActividadesService,
    private router: Router,
    private authService: AuthService
  ) {
    this.tiempoForm = this.fb.group({
      actividadId: ['', Validators.required],
      fecha: ['', Validators.required],
      horas: ['', [Validators.required, Validators.min(0.25), Validators.pattern('^(0|[1-9]\d*)(\.\d+)?$')]]
    });
  }

  ngOnInit(): void {
    const modalElement = document.getElementById('modalTiempo');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    forkJoin([
      this.tiemposService.getTiempos(),
      this.actividadesService.getActividades()
    ]).subscribe({
      next: ([tiempos, actividades]) => {
        this.tiempos = tiempos;
        this.actividades = actividades;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.loading = false;
        alert('Error al cargar los datos. Por favor, inténtelo de nuevo.');
      }
    });
  }

  abrirModalTiempo(tiempo?: any): void {
    if (tiempo) {
      this.tiempoId = tiempo.id;
      this.tiempoForm.patchValue({
        actividadId: tiempo.actividadId,
        fecha: new Date(tiempo.fecha).toISOString().split('T')[0],
        horas: tiempo.horas
      });
    } else {
      this.tiempoId = null;
      this.tiempoForm.reset();
    }
    if (this.modal && typeof this.modal.show === 'function') {
      this.modal.show();
    } else {
      console.error('Modal no inicializado o método show no disponible');
    }
  }

  abrirModalEditar(tiempo: any): void {
    this.abrirModalTiempo(tiempo);
  }

  guardarTiempo(): void {
    if (this.tiempoForm.valid) {
      const tiempo = this.tiempoForm.value;
      
      this.loading = true;
      if (this.tiempoId) {
        this.tiemposService.actualizarTiempo(this.tiempoId, tiempo).subscribe({
          next: () => {
            this.modal.hide();
            this.cargarDatos();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al actualizar tiempo:', error);
            this.loading = false;
            alert('Error al actualizar el tiempo. Por favor, inténtelo de nuevo.');
          }
        });
      } else {
        this.tiemposService.registrarTiempo(tiempo).subscribe({
          next: () => {
            this.modal.hide();
            this.cargarDatos();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al registrar tiempo:', error);
            this.loading = false;
            alert('Error al registrar el tiempo. Por favor, inténtelo de nuevo.');
          }
        });
      }
    }
  }

  eliminarTiempo(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tiempo?')) {
      this.loading = true;
      this.tiemposService.eliminarTiempo(id).subscribe({
        next: () => {
          this.cargarDatos();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al eliminar tiempo:', error);
          this.loading = false;
          alert('Error al eliminar el tiempo. Por favor, inténtelo de nuevo.');
        }
      });
    }
  }
}
