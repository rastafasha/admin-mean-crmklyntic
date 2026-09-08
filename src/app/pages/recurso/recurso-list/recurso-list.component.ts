import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recurso } from 'src/app/models/recurso';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { RecursoService } from 'src/app/services/recurso.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recurso-list',
  standalone: false,
  templateUrl: './recurso-list.component.html',
  styleUrl: './recurso-list.component.css'
})
export class RecursoListComponent implements OnInit{

  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';
  selectedEstado: string = '';

  title: string = 'Recursos';
  recursos: Recurso[];
  query: string = '';
  p: number = 1;
  count: number = 6;
  loading: boolean = false;
  selectedRecurso: Recurso;
  usuario: any;
  usuario_id: any;

  constructor(
  private recursoService: RecursoService,
  private busquedasService: BusquedasService,
) {
  let USER = localStorage.getItem('usuario');
  
  try {
    // Si USER existe y no es una cadena vacía o "undefined", lo parsea. 
    // De lo contrario, asigna un objeto vacío seguro {}.
    this.usuario = USER && USER !== 'undefined' ? JSON.parse(USER) : {};
  } catch (error) {
    console.error("Error al parsear el usuario del localStorage:", error);
    this.usuario = {}; // Fallback seguro para evitar que la aplicación explote
  }
}



  ngOnInit(): void {
    this.getRecursosList();
  }

  getRecursosList() {
  this.loading = true;
  this.recursoService.getRecursos().subscribe((resp: any) => {
    this.recursos = resp; // Recibe el array mapeado de forma segura
    this.loading = false;
  });
}




  onEditRecurso(recurso: Recurso) {
    this.selectedRecurso = recurso;
  }

  onDeleteRecurso(recurso: Recurso) {
    this.selectedRecurso = recurso;

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
        this.recursoService.deleteRecurso(recurso._id).subscribe((resp: any) => {
          this.getRecursosList();
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

  openEditModalRecurso(): void {
    this.selectedRecurso = null;
  }

  onCloseModal(): void {
    this.selectedRecurso = null;
  }


  search() {
    // CASO 1: No hay término de búsqueda escrito en el input
    if (!this.query || this.query.trim() === '') {

      // Subcaso A: Seleccionó una categoría (con o sin estado)
      if (this.selectedType) {
        return this.recursoService.getProjectsByCategory(this.selectedType, this.selectedEstado)
          .subscribe((resp: any) => {
            this.recursos = resp;
            this.recursoService.emitFilteredRecursos(resp);
          });
      }
      
      // Subcaso C: Sin filtros seleccionados
      else {
        this.ngOnInit();
        return;
      }
    }

    // CASO 2: Sí hay un término de búsqueda en el input de texto
    else {
      return this.busquedasService.searchGlobal(this.query, this.selectedEstado)
        .subscribe((resp: any) => {
          let filteredRecursos = resp.projects || [];

          if (this.selectedType) {
            filteredRecursos = filteredRecursos.filter(
              (project: any) => project.category?.nombre === this.selectedType
            );
          }

          this.recursos = filteredRecursos;
          this.recursoService.emitFilteredRecursos(filteredRecursos);
        });
    }
  }

   PageSize() {
    this.query = '';
    this.ngOnInit();

  }


}
