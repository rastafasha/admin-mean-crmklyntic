import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Consultorio } from 'src/app/models/consultorio';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { ConsultorioService } from 'src/app/services/consultorio.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultorio-list',
  standalone:false,
  templateUrl: './consultorio-list.component.html',
  styleUrl: './consultorio-list.component.css'
})
export class ConsultorioListComponent {

  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';

  title: string = 'Consultorios';
  consultorios: Consultorio[];
  query: string = '';
  p: number = 1;
  count: number = 5;
  loading: boolean = false;
  categories: Speciality[];
  consultorioSeleccionado: Consultorio;
  usuario: any;
  usuario_id: any;

  constructor(
    private consultorioService: ConsultorioService,
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
      // if (this.usuario_id) {
      //   this.getClientesBySlug(this.usuario_id);
      // }
    })


    if (this.usuario.role === 'PARTNER') {
      // this.usuario.uid = this.usuario_id;
      // this.getClientesBySlug(this.usuario.uid);

    } else {
      this.getClients();
    }

  }

  getClients() {
    this.loading = true;
    this.consultorioService.getConsultorios().subscribe((resp: any) => {
      this.consultorios = resp;
      this.loading = false;
    })
  }

  // getClientesBySlug(id: string) {
  //   this.loading = true;
  //   this.consultorioService.getByUser(id).subscribe((resp: any) => {
  //     this.consultorios = resp;
  //     this.loading = false;
  //   })
  // }

  getCategories() {
    this.categoriaService.getSpecialities().subscribe((resp: any) => {
      this.categories = resp;
    })

  }

  onEditClient(consultorio: Consultorio) {
    this.consultorioSeleccionado = consultorio;
    
  }

  onDeleteClient(consultorio: Consultorio) {
    this.consultorioSeleccionado = consultorio;

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
        this.consultorioService.deleteConsultorio(consultorio._id).subscribe((resp: any) => {
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

 

  PageSize() {
    this.query = '';
    this.selectedType = '';
    this.ngOnInit();

  }
  openEditModal(): void {
    this.consultorioSeleccionado = null;
  }

  onCloseModal(): void {
    this.consultorioSeleccionado = null;
  }
}
