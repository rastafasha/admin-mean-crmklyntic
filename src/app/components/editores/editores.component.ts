import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-editores',
    templateUrl: './editores.component.html',
    styleUrls: ['./editores.component.css'],
    standalone: false
})
export class EditoresComponent implements OnInit {

  editor: User;
  editores: User;
  p: number = 1;
  count: number = 8;
  error: string;
  msm_error: string;
  loading = false;

  constructor(
    private userService: UserService,
    handler: HttpBackend,
  ) {
   }

  ngOnInit(): void {
    // this.activatedRoute.params.subscribe( ({role}) => this.getEditores(role));
    this.getEditores();
    window.scrollTo(0,0);
  }

  getEditores(): void {
    // return this.planesService.carga_info();
    this.userService.getAllEditors().subscribe(
      res =>{
        this.editores = res;
        error => this.error = error;
      }
    );
  }

  eliminarEditor(editor:User){
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
        this.userService.deleteById(editor).subscribe(
          response =>{
            this.ngOnInit();
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

}
