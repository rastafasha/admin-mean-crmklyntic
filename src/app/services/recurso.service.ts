import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recurso } from '../models/recurso';
const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  public recurso: Recurso;

   private filteredRecursosSubject = new BehaviorSubject<Recurso[]>([]);
    public filteredRecursos$: Observable<Recurso[]> = this.filteredRecursosSubject.asObservable();
  


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


  getRecursos() {
    const url = `${baseUrl}/recursos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, recursos: Recurso }) => resp.recursos)
      )
  }


  getRecurso(_id: string) {
    const url = `${baseUrl}/recursos/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, recurso: Recurso }) => resp.recurso)
      );
  }


  createRecurso(recurso: Recurso) {
    const url = `${baseUrl}/recursos/store`;
    return this.http.post(url, recurso, this.headers);
  }

  updateRecurso(recurso: Recurso) {
    const url = `${baseUrl}/recursos/update/${recurso._id}`;
    return this.http.put(url, recurso, this.headers);
  }

  deleteRecurso(_id: string) {
    const url = `${baseUrl}/recursos/delete/${_id}`;
    return this.http.delete(url, this.headers);
  }

  getProjectsByCategory(categoryName: string, status?: string) {
    const url = `${baseUrl}/recursos/category/${categoryName}`;
    
    // Configuramos los parámetros de la URL de forma limpia
    let params = new HttpParams();
    if (status) {
        params = params.set('estado_seguimiento', status);
    }

    return this.http.get<any>(url, {
        ...this.headers,
        params
    })
    .pipe(
        map((resp: { ok: boolean, recursos: Recurso[] }) => resp.recursos)
    );
}

  
   emitFilteredRecursos(recursos: Recurso[]) {
      this.filteredRecursosSubject.next(recursos);
    }
}
