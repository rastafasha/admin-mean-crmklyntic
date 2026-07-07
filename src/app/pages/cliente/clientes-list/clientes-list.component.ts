import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-clientes-list',
    templateUrl: './clientes-list.component.html',
    styleUrls: ['./clientes-list.component.css'],
    standalone: false
})
export class ClientesListComponent implements OnInit {

  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';

  title: string = 'Clientes';
  clientes: Cliente[];
  query: string = '';
  p: number = 1;
  count: number = 5;
  loading: boolean = false;
  categories: Speciality[];
  selectedClient: Cliente;
  usuario: any;
  usuario_id: any;

  constructor(
    private clienteService: ClienteService,
    private busquedasService: BusquedasService,
    private categoriaService: SpecialityService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,

  ) {
    let USER = localStorage.getItem('user');
    this.usuario = JSON.parse(USER ? USER : '');
  }



  ngOnInit(): void {
    this.getCategories();
    this.activatedRoute.params.subscribe((resp: any) => {
      this.usuario_id = resp.id;
      // this.cargarPresupuesto();
      if (this.usuario_id) {
        this.getClientesByUser(this.usuario_id);
      }
    })


    if (this.usuario.role === 'PARTNER') {
      // this.usuario.uid = this.usuario_id;
      this.getClientesByUser(this.usuario.uid);

    } else {
      this.getClients();
    }

  }

  getClients() {
    this.loading = true;
    this.clienteService.getClientes().subscribe((resp: any) => {
      this.clientes = resp;
      this.loading = false;
    })
  }

  getClientesByUser(id: string) {
    this.loading = true;
    this.clienteService.getByUser(id).subscribe((resp: any) => {
      this.clientes = resp;
      this.loading = false;
    })
  }

  getCategories() {
    this.categoriaService.getSpecialities().subscribe((resp: any) => {
      this.categories = resp;
    })

  }

  onEditClient(cliente: Cliente) {
    this.selectedClient = cliente;
  }

  onDeleteClient(cliente: Cliente) {
    this.selectedClient = cliente;

    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cliente._id).subscribe((resp: any) => {
          this.getClients();
        })
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }

  search() {
    // Case 1: Only selectedType (category) is provided - use category filter
    if (!this.query || this.query === null || this.query === '') {
      if (this.selectedType) {
        return this.clienteService.getClientesByCategory(this.selectedType).subscribe(
          (resp: any) => {
            this.clientes = resp;
            this.clienteService.emitFilteredClientes(resp);
          }
        );
      } else {
        // No query and no category - reload all projects
        this.ngOnInit();
      }
    }
    // Case 2: Query is provided (with or without category)
    else {
      return this.busquedasService.searchGlobal(this.query).subscribe(
        (resp: any) => {
          let filteredClientes = resp.clientes;
          if (this.selectedType) {
            filteredClientes = filteredClientes.filter(
              (cliente: Cliente) => cliente.category.nombre === this.selectedType
            );
          }
          this.clientes = filteredClientes;
          this.clienteService.emitFilteredClientes(filteredClientes);
        }
      );
    }
  }


  PageSize() {
    this.query = '';
    this.selectedType = '';
    this.ngOnInit();

  }
  openEditModal(): void {
    this.selectedClient = null;
  }

  onCloseModal(): void {
    this.selectedClient = null;
  }

}
