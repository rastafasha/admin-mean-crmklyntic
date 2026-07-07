import { Component, OnInit, Input } from '@angular/core';

//Services
import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { Speciality } from 'src/app/models/speciality';
import { SpecialityService } from 'src/app/services/speciality.service';


@Component({
    selector: 'app-category-index',
    templateUrl: './category-index.component.html',
    styleUrls: ['./category-index.component.css'],
    standalone: false
})
export class CategoryIndexComponent implements OnInit {

  @Input() displaycomponent: string = 'block';
  title = "Specialities"
  categorias: Speciality;
  user: User;
  p: number = 1;
  count: number = 8;
  error: string;
  msm_error: string;
  loading = false;

  query: string = '';

  constructor(
    private location: Location,
    private http: HttpClient,
    private categoryService: SpecialityService,
    handler: HttpBackend,
    private busquedasService: BusquedasService,

  ) {
    this.http = new HttpClient(handler);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getCategorias();
    this.getUser();
    this.closeMenu();
  }

  getUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getCategorias(): void {
    this.categoryService.getSpecialities().subscribe(
      res => {
        this.categorias = res;
        error => this.error = error
      }
    );
  }

  PageSize() {
    this.getCategorias();

  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }

  eliminarCategory(_id: string) {
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
        this.categoryService.deleteSpeciality(_id).subscribe(
          response => {
            this.getCategorias();
          }
        );
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  search() {
    if (!this.query) {
      this.ngOnInit();
    } else {
      return this.busquedasService.searchGlobal(this.query).subscribe(
        (resp: any) => {
          this.categorias = resp.categorias;

        }
      )
    }
  }

}
