import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Doctor } from 'src/app/models/doctor';
import { Pais } from 'src/app/models/pais.model';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: false
})
export class ProjectEditComponent implements OnInit, OnChanges {
  @Input() projectSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  projectForm: FormGroup;
  title: string;
  usuario: any;
  partners: User[];
  project: Doctor;
  id: string;
  specialities: Speciality;
  paises: Pais;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private authService: AuthService,
    private projectService: DoctorService,
    private paisService: PaisService,
    private categoryService: SpecialityService,
    private fileUploadService: FileUploadService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
    this.getCategorias();
    this.getPartners();
    this.getPaises();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['projectSeleccionado'] &&
      changes['projectSeleccionado'].currentValue
    ) {
      this.title = 'Editando Proyecto';
      const project = changes['projectSeleccionado'].currentValue;
      this.setPartnersFormArray(project.partners);
      this.projectForm.patchValue({
        id: project._id,
        name: project.name,
        slug: project.slug,
        num_whatsapp: project.num_whatsapp,
        url: project.url,
        rrss: project.rrss,
        category: project.category._id,
        ubicacion: project.ubicacion,
        pais: project.pais._id,
        hasVisited: project.hasVisited,
        negociacion: project.negociacion,
        propuesta: project.propuesta,
        hasMenu: project.hasMenu,
        dateVisita: project.dateVisita,
        dateAprobado: project.dateAprobado,
        tipoMenu: project.tipoMenu,
        notificado: project.notificado,
        status: project.status,
        estado_seguimiento: project.estado_seguimiento,
        email_contacto: project.email_contacto,
        canal_origen: project.canal_origen,
        correo_enviado: project.correo_enviado,
      });
      this.projectSeleccionado = project;
      this.title = 'Editando Proyecto';
    } else {
      this.title = 'Editando Proyecto';
    }

  }

  getCategorias() {
    this.categoryService.getSpecialities().subscribe((resp: any) => {
      this.specialities = resp;
    });
  }
  getPaises() {
    this.paisService.getPaises().subscribe((resp: any) => {
      this.paises = resp;
    });
  }

  getPartners() {
    this.usuarioService.getAllEditors().subscribe((resp: any) => {
      this.partners = resp;
      this.setPartnersFormArray([]);
    });
  }

  setPartnersFormArray(selectedPartners: string[]) {
    const partnersFormArray = this.fb.array([]);
    if (this.partners && this.partners.length > 0) {
      this.partners.forEach((partner) => {
        const isSelected = selectedPartners.includes(partner.uid);
        partnersFormArray.push(new FormControl(isSelected));
      });
    }
    this.projectForm.setControl('partners', partnersFormArray);
  }

  validarFormulario() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      url: [''],
      slug: [''],
      num_whatsapp: [''],
      rrss: ['', Validators.required],
      category: ['', Validators.required],
      hasMenu: ['', Validators.required],
      tipoMenu: ['', Validators.required],
      ubicacion: ['', Validators.required],
      pais: ['', Validators.required],
      dateVisita: [''],
      dateAprobado: [''],
      negociacion: [''],
      propuesta: [''],
      estado_seguimiento: ['PENDIENTE'],
      email_contacto: [''],
      canal_origen: [''],
      correo_enviado: [''],
      status: [false],
      hasVisited: [false],
      notificado: [false],
      partners: this.fb.array([],),
      // img: [''],
      id: [''],
    });
  }


  onClose() {
    this.projectSeleccionado = null;
    this.currentStep = 1;
    this.projectForm.reset();
    this.title = 'Creando Proyecto';
    // Also reset default values if needed
    this.projectForm.patchValue({
      name: null,
      url: null,
      slug: null,
      num_whatsapp: null,
      rrss: null,
      category: null,
      hasMenu: null,
      tipoMenu: null,
      ubicacion: null,
      pais: null,
      dateVisita: null,
      dateAprobado: null,
      negociacion: null,
      propuesta: null,
      status: [false],
      hasVisited: [false],
      notificado: [false],
      partners: null,
      estado_seguimiento: null,
      email_contacto: null,
      canal_origen: null,
      correo_enviado: null,
      img: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable
    

     // Close modal programmatically
        const modalElement = document.getElementById('editProject');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshProjectList.emit();
        this.closeModal.emit();
        this.ngOnInit()
  }

  nextStep() {
    const name = this.projectForm.get('name');
    const url = this.projectForm.get('url');
    const num_whatsapp = this.projectForm.get('num_whatsapp');
    const category = this.projectForm.get('category');
    const hasMenu = this.projectForm.get('hasMenu');
    const pais = this.projectForm.get('pais');
    const rrss = this.projectForm.get('rrss');
    const ubicacion = this.projectForm.get('ubicacion');
    const tipoMenu = this.projectForm.get('tipoMenu');
    const dateVisita = this.projectForm.get('dateVisita');
    const dateAprobado = this.projectForm.get('dateAprobado');
    const hasVisited = this.projectForm.get('hasVisited');

    if (name?.invalid || url?.invalid ||
      num_whatsapp?.invalid || category?.invalid ||
      hasMenu?.invalid || pais?.invalid ||
      rrss?.invalid || ubicacion?.invalid ||
      tipoMenu?.invalid ||
      dateVisita?.invalid ||
      dateAprobado?.invalid ||
      hasVisited?.invalid 

    ) {
      name?.markAsTouched();
      url?.markAsTouched();
      num_whatsapp?.markAsTouched();
      category?.markAsTouched();
      hasMenu?.markAsTouched();
      pais?.markAsTouched();
      rrss?.markAsTouched();
      ubicacion?.markAsTouched();
      tipoMenu?.markAsTouched();
      dateVisita?.markAsTouched();
      dateAprobado?.markAsTouched();
      hasVisited?.markAsTouched();
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;


  }

  nextStep3(){
    this.currentStep = 3;
  }

  prevStep() {
    this.currentStep = 1;
  }
  prevStep2() {
    this.currentStep = 2;
  }


  handleSubmit() {
    if (!this.projectForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { nombre } = this.projectForm.value;
    // Extract selected partner IDs from the FormArray
    const selectedPartners = this.projectForm.value.partners
      .map((checked, i) => (checked ? this.partners[i].uid : null))
      .filter((v) => v !== null);

    const dataToSend = {
      ...this.projectForm.value,
      // formData,
      partners: selectedPartners,
    };

    if (this.projectSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.projectSeleccionado._id,
      };
      this.projectService.updateDoctor(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${name}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editProject');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshProjectList.emit();
        this.ngOnInit()
      });
    } else {
      //crear
      this.projectService.createDoctor(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.projectSeleccionado = resp;
        Swal.fire('¡Paso 1 completado!', 'Tienda creada. Ahora Agrega la info para el menu y sube la imagen.', 'success');
        this.currentStep = 2;
      });
    }
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.cargandoImagen = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'projects', this.projectSeleccionado._id)
      .then(img => {
        this.projectSeleccionado.img = img;
        this.cargandoImagen = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        this.cargandoImagen = false;
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

}
