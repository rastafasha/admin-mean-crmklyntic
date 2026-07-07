import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';

import { Location } from '@angular/common';
import { Cliente } from 'src/app/models/cliente';
import { Doctor } from 'src/app/models/doctor';

@Component({
    selector: 'app-busqueda',
    templateUrl: './busqueda.component.html',
    styleUrls: ['./busqueda.component.css'],
    standalone: false
})
export class BusquedaComponent implements OnInit {

  

  projects: Doctor;
  // projecttypes: ProjectType;
  usuarios: User;
  clientes: Cliente;
  specialities: any;

  query:string ='';

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private location: Location,
     ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({termino}) => {
        this.busquedaGlobal(termino);
      }
    )
  }


  busquedaGlobal(termino: string){
    this.busquedasService.searchGlobal(termino).subscribe(
      (resp:any) => {
        this.usuarios = resp.usuarios;
        this.projects = resp.projects;
        this.clientes = resp.clientes;
        // this.projecttypes = resp.projecttypes;
      }
    )
  }

  search() {

    if(!this.query|| this.query === null){
      this.ngOnInit();
    }else{
      return this.busquedasService.searchGlobal(this.query).subscribe(
        (resp:any) => {
          this.usuarios = resp.usuarios;
          this.projects = resp.projects;
          this.clientes = resp.clientes;
          // this.projecttypes = resp.projecttypes;
      
          console.log(resp);
        }
      )
    }
    
        
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
