import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor';

// Usamos la URL base de tu backend independiente (Node.js desplegado en Render)
const base_url = environment.apiUrl; 

export interface ProspectoResponse {
  ok: boolean;
  total?: number;
  msg?: string;
  doctores?: Doctor[];
  doctor?: Doctor;
  messageId?: string;
}

@Injectable({
  providedIn: 'root' // Lo hace disponible globalmente de forma autónoma
})
export class ProspectoService {

  // El prefijo de la ruta que definimos en Express para el CRM independiente
  private prefix = '/prospectos';

  constructor(private http: HttpClient) { }

  /**
   * 1. LISTAR PROSPECTOS: Obtiene los médicos con soporte para filtros opcionales (selects del CRM)
   * @param ubicacion Filtro por clínica opcional (ej: 'HCC', 'Razetti')
   * @param enviado Filtro opcional por estado de Mailjet ('true' o 'false')
   */
  obtenerProspectos(ubicacion?: string, enviado?: boolean): Observable<ProspectoResponse> {
    let params = new HttpParams();
    
    if (ubicacion) {
      params = params.set('ubicacion', ubicacion);
    }
    
    if (enviado !== undefined) {
      params = params.set('enviado', enviado.toString());
    }

    return this.http.get<ProspectoResponse>(`${base_url}${this.prefix}`, { params }).pipe(
      map(resp => {
        // Instanciamos dinámicamente cada registro como una clase Doctor viva
        // para que hereden el método 'get imagenUrl' que creaste.
        if (resp.doctores) {
          resp.doctores = resp.doctores.map(docData => Object.assign(new Doctor(), docData));
        }
        return resp;
      })
    );
  }

  /**
   * 2. REGISTRO MANUAL: Guarda un médico recolectado a pie individualmente en el CRM
   */
  crearProspecto(prospecto: Partial<Doctor>): Observable<ProspectoResponse> {
    return this.http.post<ProspectoResponse>(`${base_url}${this.prefix}/store`, prospecto);
  }

  /**
   * 3. ENVÍO INDIVIDUAL: Dispara el correo bonito de Mailjet pasando el ID del médico
   */
  enviarCorreoIndividual(id: string): Observable<ProspectoResponse> {
    return this.http.post<ProspectoResponse>(`${base_url}${this.prefix}/enviar-correo`, { id });
  }

  /**
   * 4. ENVÍO MASIVO (BULK): Dispara el lote diario de 200 correos en segundo plano
   */
  enviarCampañaMasiva(): Observable<ProspectoResponse> {
    return this.http.post<ProspectoResponse>(`${base_url}${this.prefix}/enviar-masivo`, {});
  }
}
