import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Recurso } from 'src/app/models/recurso';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { RecursoService } from 'src/app/services/recurso.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-recurso-edit',
  standalone:false,
  templateUrl: './recurso-edit.component.html',
  styleUrl: './recurso-edit.component.css'
})
export class RecursoEditComponent implements OnInit, OnChanges{

   @Input() recursoSeleccionado;
  @Output() refreshRecursoList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  projectForm: FormGroup;
  title: string;
  usuario: any;
  partners: User[];
  project: Recurso;
  id: string;

  isLoading: boolean = false;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recursoService: RecursoService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['recursoSeleccionado'] &&
      changes['recursoSeleccionado'].currentValue
    ) {
      this.title = 'Editando Recurso';
      const project = changes['recursoSeleccionado'].currentValue;
      
      this.projectForm.patchValue({
        id: project._id,
        titulo: project.titulo,
        descripcion: project.descripcion,
        urlMedia: project.urlMedia,
        activo: project.activo,
        fechaCreacion: project.fechaCreacion,
        tipo: project.tipo,
        categoria: project.categoria,
        
      });
      this.recursoSeleccionado = project;
      this.title = 'Editando Recurso';
    } else {
      this.title = 'Editando Recurso';
    }

  }

 
 


  validarFormulario() {
    this.projectForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      urlMedia: [''],
      activo: [false],
      fechaCreacion: ['',],
      tipo: ['',],
      categoria: ['', Validators.required],
      id: [''],
    });
  }


  onClose() {
    this.recursoSeleccionado = null;
    this.currentStep = 1;
    this.projectForm.reset();
    this.title = 'Creando Recurso';
    // Also reset default values if needed
    this.projectForm.patchValue({
      titulo: null,
      descripcion: null,
      urlMedia: null,
      activo: false,
      fechaCreacion: null,
      tipo: null,
      categoria: null,
      youtubeurl: null,
    });
    // Emit event to parent to reset the recursoSeleccionado variable
    

     // Close modal programmatically
        const modalElement = document.getElementById('editRecurso');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshRecursoList.emit();
        this.closeModal.emit();
        this.ngOnInit()
  }

  
  handleSubmit() {
    if (!this.projectForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { titulo } = this.projectForm.value;

    const dataToSend = {
    usuario: this.usuario.uid,
      ...this.projectForm.value,
    };

    if (this.recursoSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.recursoSeleccionado._id,
      };
      this.recursoService.updateRecurso(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${titulo}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editRecurso');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshRecursoList.emit();
        this.ngOnInit()
      });
    } else {
      //crear
      this.recursoService.createRecurso(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.recursoSeleccionado = resp;
        Swal.fire('¡Creado!', 'Recurso creada.', 'success');
         // Close modal programmatically
        const modalElement = document.getElementById('editRecurso');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshRecursoList.emit();
        this.ngOnInit()
      });
    }
  }

 


}
