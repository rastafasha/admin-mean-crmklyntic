import { Component, Input } from '@angular/core';
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
export class RecursoListComponent {

  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';
  selectedEstado: string = '';

  title: string = 'Proyectos';
  recursos: Recurso[];
  query: string = '';
  p: number = 1;
  count: number = 6;
  loading: boolean = false;
  selectedProject: Recurso;
  usuario: any;
  usuario_id: any;

  constructor(
    private recursoService: RecursoService,
    private busquedasService: BusquedasService,
    private activatedRoute: ActivatedRoute,

  ) {
    let USER = localStorage.getItem('usuario');
    this.usuario = JSON.parse(USER ? USER : '');
  }



  ngOnInit(): void {
    this.activatedRoute.params.subscribe((resp: any) => {
      this.usuario_id = resp.id;
    })

    this.getRecursos();

  }

  getRecursos() {
    this.loading = true;
    this.recursoService.getRecursos().subscribe((resp: any) => {
      this.recursos = resp;
      this.loading = false;
    })
  }




  onEditProject(project: Recurso) {
    this.selectedProject = project;
  }

  onDeleteProject(project: Recurso) {
    this.selectedProject = project;

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
        this.recursoService.deleteRecurso(project._id).subscribe((resp: any) => {
          this.getRecursos();
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
      // Subcaso B: NO hay categoría, pero SÍ hay un estado seleccionado (Usa el nuevo método seguro)
      else if (this.selectedEstado) {
        return this.busquedasService.searchByCollection('recursos', '', this.selectedEstado)
          .subscribe((resp: any) => {
            this.recursos = resp.resultados || [];
            this.recursoService.emitFilteredRecursos(this.recursos);
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
    this.selectedType = '';
    this.selectedEstado = '';
    this.ngOnInit();

  }
  openEditModal(): void {
    this.selectedProject = null;
  }

  onCloseModal(): void {
    this.selectedProject = null;
  }

}
