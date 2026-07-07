import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public cliente: Cliente;
    public user: User;
  
    private filteredClientesSubject = new BehaviorSubject<Cliente[]>([]);
    public filteredClientes$: Observable<Cliente[]> = this.filteredClientesSubject.asObservable();
  
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
  
    getClientes() {
      const url = `${baseUrl}/clientes/`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp: { ok: boolean, clientes: Cliente[] }) => resp.clientes)
        )
    }
  
    getClientesByCategory(categoryName: string) {
      const url = `${baseUrl}/clientes/category/${categoryName}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp: { ok: boolean, clientes: Cliente[] }) => resp.clientes)
        )
    }
  
    getCliente(_id: string) {
      const url = `${baseUrl}/clientes/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp: { ok: boolean, cliente: Cliente }) => resp.cliente)
        );
    }
  
    getByUser(usuario: any) {
      const url = `${baseUrl}/clientes/user/${usuario}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp: { ok: boolean, clientes: Cliente[] }) => resp.clientes)
        )
    }
  
    createCliente(cliente: Cliente) {
      const url = `${baseUrl}/clientes/store`;
      return this.http.post(url, cliente, this.headers);
    }
  
    updateCliente(cliente: Cliente) {
      const url = `${baseUrl}/clientes/update/${cliente._id}`;
      return this.http.put(url, cliente, this.headers);
    }
  
    updateClienteStatus(cliente: Cliente) {
      const url = `${baseUrl}/clientes/updatestatus/${cliente._id}`;
      return this.http.put(url, cliente, this.headers);
    }
  
    deleteCliente(_id: string) {
      const url = `${baseUrl}/clientes/delete/${_id}`;
      return this.http.delete(url, this.headers);
    }
  
    emitFilteredClientes(clientes: Cliente[]) {
      this.filteredClientesSubject.next(clientes);
    }
}
