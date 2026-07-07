import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Contact } from '../models/contact';
import { CargarContacto } from '../auth/interfaces/cargar-mensajes.interface';

@Injectable({
  providedIn: 'root'
})
export class CmspageService {

  public contact:Contact;
  ServerUrl = environment.apiUrl;
  errorData: {};

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private http: HttpClient;

  constructor(handler: HttpBackend) {
      this.http = new HttpClient(handler);
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }

  contactForm(data:any):Observable<any>{
    const url = `${this.ServerUrl}/contactos/crear`;
    return this.http.post(url, data, this.headers);
  }

  listar():Observable<any>{
    const url = `${this.ServerUrl}/contactos`;
    return this.http.get(url, this.headers);
  }

  borrarMessage(_id:string){
    const url = `${this.ServerUrl}/contactos/${_id}`;
    return this.http.delete(url, this.headers);
  }


  cargarMensajes(desde: number = 0){

    const url = `${this.ServerUrl}/contactos?desde=${desde}`;
    return this.http.get<CargarContacto>(url, this.headers)
      .pipe(
        map( resp =>{
          const contactos = resp.contactos.map(
            contacto => new Contact());

          return {
            total: resp.total,
            contactos

          }
        })
      )
  }
}
