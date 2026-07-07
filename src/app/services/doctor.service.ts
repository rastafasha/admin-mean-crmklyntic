

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  public doctor: Doctor;
  public user: User;

  private filteredDoctorsSubject = new BehaviorSubject<Doctor[]>([]);
  public filteredDoctors$: Observable<Doctor[]> = this.filteredDoctorsSubject.asObservable();

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
    const url = `${baseUrl}/projects/`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, projects: Doctor[] }) => resp.projects)
      )
  }

 getProjectsByCategory(categoryName: string, estado?: string) {
    const url = `${baseUrl}/projects/category/${categoryName}`;
    
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
}
