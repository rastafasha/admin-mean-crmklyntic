import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Condiciones } from '../models/condiciones';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CondicionesService {

  public condiciones: Condiciones;


  constructor(private http: HttpClient) { }

  get token():string{
    return sessionStorage.getItem('auth-token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }




}
