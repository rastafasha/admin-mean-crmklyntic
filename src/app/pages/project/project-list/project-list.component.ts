import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: false
})
export class ProjectListComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';
  selectedEstado: string = '';

  title: string = 'Proyectos';
  projects: Doctor[];
  query: string = '';
  p: number = 1;
  count: number = 6;
  loading: boolean = false;
  specialities: Speciality[];
  selectedProject: Doctor;
  usuario: any;
  usuario_id: any;

  constructor(
    private projectService: DoctorService,
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
        this.getProjectsByUser(this.usuario_id);
      }
    })


    if (this.usuario.role === 'PARTNER') {
      // this.usuario.uid = this.usuario_id;
      this.getProjectsByUser(this.usuario.uid);

    } else {
      this.getProjects();
    }

  }

  getProjects() {
    this.loading = true;
    this.projectService.getProjects().subscribe((resp: any) => {
      this.projects = resp;
      this.loading = false;
    })
  }

  getProjectsByUser(id: string) {
    this.loading = true;
    this.projectService.getByUser(id).subscribe((resp: any) => {
      this.projects = resp;
      this.loading = false;
    })
  }

  getCategories() {
    this.categoriaService.getSpecialities().subscribe((resp: any) => {
      this.specialities = resp;
    })

  }

  onEditProject(project: Doctor) {
    this.selectedProject = project;
  }

  onDeleteProject(project: Doctor) {
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
        this.projectService.deleteDoctor(project._id).subscribe((resp: any) => {
          this.getProjects();
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
      return this.projectService.getProjectsByCategory(this.selectedType, this.selectedEstado)
        .subscribe((resp: any) => {
          this.projects = resp;
          this.projectService.emitFilteredDoctors(resp);
        });
    } 
    // Subcaso B: NO hay categoría, pero SÍ hay un estado seleccionado (Usa el nuevo método seguro)
    else if (this.selectedEstado) {
      return this.busquedasService.searchByCollection('doctors', '', this.selectedEstado)
        .subscribe((resp: any) => {
          this.projects = resp.resultados || [];
          this.projectService.emitFilteredDoctors(this.projects);
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
        let filteredProjects = resp.projects || [];

        if (this.selectedType) {
          filteredProjects = filteredProjects.filter(
            (project: any) => project.category?.nombre === this.selectedType
          );
        }

        this.projects = filteredProjects;
        this.projectService.emitFilteredDoctors(filteredProjects);
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

