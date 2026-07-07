import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { Speciality } from 'src/app/models/speciality';
import { SpecialityService } from 'src/app/services/speciality.service';
@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.css'],
    standalone: false
})
export class CategoryEditComponent implements OnInit {

  @Input() displaycomponent: string = 'block';
  @Input() categories: Speciality;

  title: string;
  public categoryForm: FormGroup;
  public category: Speciality;
  public usuario: User;
  error: string;
  isLoading: boolean = false;

  idcategory: any;

  public msm_error = '';

  public categorySeleccionado: Speciality;
  specialityExiste: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private categoriaService: SpecialityService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.apiUrl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarCategory(id));
    this.validarFormulario();
    this.getCategories();
    window.scrollTo(0, 0);

    if (this.categorySeleccionado) {
      //actualizar
      this.title = 'Creando Categoría';

    } else {
      //crear
      this.title = 'Editar Categoría';
    }
  }

  validarFormulario() {
    this.categoryForm = this.fb.group({
      nombre: ['', Validators.required],
    })
  }

  cargarCategory(_id: string) {
    if (_id !== null && _id !== undefined) {
      this.title = 'Editando Categoría';
      this.categoriaService.getSpeciality(_id).subscribe(
        (res: any) => {
          this.categoryForm.patchValue({
            id: res._id,
            nombre: res.nombre,
          });
          this.categorySeleccionado = res;
        }
      );
    } else {
      this.title = 'Creando Categoría';
    }

  }



  verificarSpeciality(event: any): void {
    const documento = event.target.value?.trim();
    const control = this.categoryForm.get('nombre');

    // 1. Si está vacío o tiene menos de 3 caracteres, limpiamos el error 'yaExiste'
    // y dejamos que Angular ejecute sus validadores nativos normales.
    if (!documento || documento.length < 3) {
      this.specialityExiste = false;
      if (control?.hasError('yaExiste')) {
        delete control.errors?.['yaExiste'];
        control.updateValueAndValidity(); // 👈 Fuerza a Angular a recalcular required/minlength
      }
      return;
    }

    // 2. Consultamos al backend si pasa los filtros básicos
    this.categoriaService.veriificarExistencia(documento).subscribe({
      next: (res: any) => {
        const control = this.categoryForm.get('nombre');

        if (res && res.existe) {
          this.specialityExiste = true;

          // Conservamos errores previos y sumamos 'yaExiste'
          const erroresActuales = control?.errors || {};
          control?.setErrors({ ...erroresActuales, yaExiste: true });

          // CORREGIDO: Usamos onlySelf en lugar del error de tipeo
          control?.markAsTouched({ onlySelf: true });
          control?.markAsDirty();
        } else {
          this.specialityExiste = false;
          if (control?.errors) {
            delete control.errors['yaExiste'];
            if (Object.keys(control.errors).length === 0) {
              control.setErrors(null);
            } else {
              control.setErrors(control.errors);
            }
          }
        }

        // Recalculamos validez y forzamos el renderizado visual en la pantalla
        control?.updateValueAndValidity({ emitEvent: true });
        this.categoryForm.updateValueAndValidity();
        this.cd.detectChanges(); // 👈 LA LÍNEA MÁGICA: Fuerza a Angular a pintar el HTML ya mismo
      },
      error: (err) => {
        console.error("Error al verificar el documento", err);
      }
    });
  }

  updateCategory() {
    this.isLoading = true;
    const { nombre } = this.categoryForm.value;

    if (this.categorySeleccionado) {
      //actualizar
      const data = {
        ...this.categoryForm.value,
        _id: this.categorySeleccionado._id
      }
      this.categoriaService.updateSpeciality(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${nombre}  actualizado correctamente`, 'success');
          // this.router.navigateByUrl(`/dashboard/categories`);
          // console.log(this.categorySeleccionado);
          this.getCategories();
          this.isLoading = false;
        });

    } else {
      //crear
      this.categoriaService.createSpeciality(this.categoryForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          // this.router.navigateByUrl(`/dashboard/categories`);
          // this.enviarNotificacion();
          this.getCategories();
          this.isLoading = false;
        })
    }

  }

  // enviarNotificacion(): void {
  //   this.alertService.success("Mensaje de Monedas","Se ha creado una nueva moneda!");
  // }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  getCategories(): void {
    this.categoriaService.getSpecialities().subscribe(
      (res: any) => {
        this.categories = res;
        error => this.error = error
      }
    );
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
        this.categoriaService.deleteSpeciality(_id).subscribe(
          response => {
            this.getCategories();
          }
        );
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.getCategories();
      }
    });

  }

}
