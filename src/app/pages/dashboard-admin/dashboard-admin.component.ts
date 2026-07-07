import { Component, Input, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.css'],
    standalone: false
})
export class DashboardAdminComponent implements OnInit {
  @Input() projects: Doctor[] = [];

  title = 'Panel Administrativo';
  public user: any;
  public profile: User;
  displaycomponent: string = 'none';
  limit = 3;

  error: string;
  uid:string;

  categorias: Speciality;
  usuarios: User;
  usuario: User;
  query:string ='';
  selectedProject:Doctor;
  projectSeleccionado:Doctor;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private projectService: DoctorService,
    

  ) {
    this.user = authService.getLocalStorage();
  }

  ngOnInit(): void {

    window.scrollTo(0,0);
    this.authService.closeMenu();
    this.uid = this.user.uid;
    this.getProjectsData();
    this.subscribeToFilteredProjects();
  }

  getProjectsData(){
    this.projectService.getProjects().subscribe((resp:any)=>{
      this.projects = resp;
    })
  }

  onEditProject(project: Doctor) {
    this.selectedProject = project;
  }
  onDeleteProject(project: Doctor) {
    this.selectedProject = project;
  }

  subscribeToFilteredProjects() {
    this.projectService.filteredDoctors$.subscribe((filteredProjects: Doctor[]) => {
      if (filteredProjects && filteredProjects.length > 0) {
        this.projects = filteredProjects;
      } else {
        this.getProjectsData();
      }
    });
  }


  openEditModal(): void {
    this.selectedProject = null;
  }

  onCloseModal(): void {
    this.projectSeleccionado = null;
  }

  PageSize() {
    this.getProjectsData();

  }
  
}
