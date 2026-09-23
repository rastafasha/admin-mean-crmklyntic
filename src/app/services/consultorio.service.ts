import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Consultorio } from '../models/consultorio';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

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

  getConsultorios() {
    const url = `${baseUrl}/consultorios/`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, consultorios: Consultorio[] }) => resp.consultorios)
      )
  }

 

  getConsultorio(_id: string) {
    const url = `${baseUrl}/consultorios/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, consultorio: Consultorio }) => resp.consultorio)
      );
  }

  getBySlug(slug: any) {
    const url = `${baseUrl}/consultorios/slug/${slug}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, consultorio: Consultorio[] }) => resp.consultorio)
      )
  }

  createConsultorio(consultorio: Consultorio) {
    const url = `${baseUrl}/consultorios/store`;
    return this.http.post(url, consultorio, this.headers);
  }

  updateConsultorio(consultorio: Consultorio) {
    const url = `${baseUrl}/consultorios/update/${consultorio._id}`;
    return this.http.put(url, consultorio, this.headers);
  }

  updateConsultorioStatus(doctor: Consultorio) {
    const url = `${baseUrl}/consultorios/updatestatus/${doctor._id}`;
    return this.http.put(url, doctor, this.headers);
  }

  deleteConsultorio(_id: string) {
    const url = `${baseUrl}/consultorios/delete/${_id}`;
    return this.http.delete(url, this.headers);
  }


}
