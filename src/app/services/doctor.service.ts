

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

const baseUrl = environment.apiUrl;
export interface ProspectoResponse {
  ok: boolean;
  total?: number;
  msg?: string;
  doctors?: Doctor[];
  doctor?: Doctor;
  messageId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  public doctor: Doctor;
  public user: User;

  private filteredDoctorsSubject = new BehaviorSubject<Doctor[]>([]);
  public filteredDoctors$: Observable<Doctor[]> = this.filteredDoctorsSubject.asObservable();

  // El prefijo de la ruta que definimos en Express para el CRM independiente
  private prefix = '/prospectos';

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  getProjects() {
    const url = `${baseUrl}/doctors/`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, doctors: Doctor[] }) => resp.doctors)
      )
  }

 getProjectsByCategory(categoryName: string, estado?: string) {
    const url = `${baseUrl}/doctors/speciality/${categoryName}`;
    
    // Configuramos los parámetros de la URL de forma limpia
    let params = new HttpParams();
    if (estado) {
        params = params.set('estado_seguimiento', estado);
    }

    return this.http.get<any>(url, {
        ...this.headers,
        params
    })
    .pipe(
        map((resp: { ok: boolean, doctors: Doctor[] }) => resp.doctors)
    );
}
 veriificarExistencia(name: string) {
    const url = `${baseUrl}/doctors/existencia/${name}`;
    return this.http.get<any>(url, this.headers);
  }

  getDoctor(_id: string) {
    const url = `${baseUrl}/doctors/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, doctor: Doctor }) => resp.doctor)
      );
  }

  getByUser(usuario: any) {
    const url = `${baseUrl}/doctors/user/${usuario}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, doctors: Doctor[] }) => resp.doctors)
      )
  }

  createDoctor(doctor: Doctor) {
    const url = `${baseUrl}/doctors/store`;
    return this.http.post(url, doctor, this.headers);
  }

  updateDoctor(doctor: Doctor) {
    const url = `${baseUrl}/doctors/update/${doctor._id}`;
    return this.http.put(url, doctor, this.headers);
  }

  updateDoctorStatus(doctor: Doctor) {
    const url = `${baseUrl}/doctors/updatestatus/${doctor._id}`;
    return this.http.put(url, doctor, this.headers);
  }

  deleteDoctor(_id: string) {
    const url = `${baseUrl}/doctors/delete/${_id}`;
    return this.http.delete(url, this.headers);
  }

  emitFilteredDoctors(doctors: Doctor[]) {
    this.filteredDoctorsSubject.next(doctors);
  }


  /**
     * 1. LISTAR PROSPECTOS: Obtiene los médicos con soporte para filtros opcionales (selects del CRM)
     * @param ubicacion Filtro por clínica opcional (ej: 'HCC', 'Razetti')
     * @param enviado Filtro opcional por estado de Mailjet ('true' o 'false')
     */
    obtenerProspectos(desde: number = 0, limite: number = 6, ubicacion?: string, enviado?: boolean): Observable<ProspectoResponse> {
  let params = new HttpParams()
    .set('desde', desde.toString())
    .set('limite', limite.toString());
  
  if (ubicacion) {
    params = params.set('ubicacion', ubicacion);
  }
  
  if (enviado !== undefined) {
    params = params.set('enviado', enviado.toString());
  }

  return this.http.get<ProspectoResponse>(`${baseUrl}${this.prefix}`, { params }).pipe(
    map(resp => {
      // Instanciamos dinámicamente cada registro como una clase Doctor viva
      // para que hereden el método 'get imagenUrl' que creaste.
      if (resp.doctors) {
        resp.doctors = resp.doctors.map(docData => Object.assign(new Doctor(), docData));
      }
      return resp;
    })
  );
}

    /**
     * 2. REGISTRO MANUAL: Guarda un médico recolectado a pie individualmente en el CRM
     */
    crearProspecto(prospecto: Partial<Doctor>): Observable<ProspectoResponse> {
      return this.http.post<ProspectoResponse>(`${baseUrl}${this.prefix}/store`, prospecto);
    }
  
    /**
     * 3. ENVÍO INDIVIDUAL: Dispara el correo bonito de Mailjet pasando el ID del médico
     */
    enviarCorreoIndividual(id: string): Observable<ProspectoResponse> {
      return this.http.post<ProspectoResponse>(`${baseUrl}${this.prefix}/enviar-correo`, { id });
    }
  
    /**
     * 4. ENVÍO MASIVO (BULK): Dispara el lote diario de 200 correos en segundo plano
     */
    enviarCampañaMasiva(): Observable<ProspectoResponse> {
      return this.http.post<ProspectoResponse>(`${baseUrl}${this.prefix}/enviar-masivo`, {});
    }

    enviarCampañaMasivaPorIds(ids: string[]): Observable<any> {
  // Le mandamos los IDs específicos seleccionados con el check al backend
  return this.http.post(`${baseUrl}${this.prefix}/enviar-masivo`, { ids });
}
}
