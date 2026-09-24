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
  standalone: false,
  templateUrl: './recurso-edit.component.html',
  styleUrl: './recurso-edit.component.css'
})
export class RecursoEditComponent implements OnInit, OnChanges {

  @Input() recursoSeleccionado;
  @Output() refreshRecursoList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  recursoForm: FormGroup;
  title: string;
  usuario: any;
  partners: User[];
  project: Recurso;
  id: string;

  // Variables para el flujo de videos locales a Cloudinary [7]
  public videoSubir!: File;
  public videoTemp: any = null;
  public cargandoVideo: boolean = false;

  isLoading: boolean = false;
  currentStep = 1; // 🚀 Control del paso activo en el asistente express

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recursoService: RecursoService,
    private fileUploadService: FileUploadService,
    private cd: ChangeDetectorRef
  ) {}

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
      
      this.recursoForm.patchValue({
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
      
      // 🚀 Si ya existe el recurso y es tipo video, podemos permitir que vaya al paso 2 directamente
      this.currentStep = 1; 
    } else {
      this.title = 'Creando Recurso';
      this.recursoSeleccionado = null;
      this.currentStep = 1;
    }
  }

  validarFormulario() {
    this.recursoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      urlMedia: [''], // No es requerido al inicio si se va a subir un archivo en el paso 2
      activo: [false],
      fechaCreacion: [new Date()],
      tipo: ['', Validators.required],
      categoria: ['', Validators.required],
      id: [''],
    });
  }

  onClose() {
    this.recursoSeleccionado = null;
    this.currentStep = 1;
    this.videoTemp = null;
    this.recursoForm.reset();
    this.title = 'Creando Recurso';
    
    this.recursoForm.patchValue({
      titulo: null,
      descripcion: null,
      urlMedia: null,
      activo: false,
      fechaCreacion: null,
      tipo: null,
      categoria: null,
    });

    const modalElement = document.getElementById('editRecurso');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
    
    this.refreshRecursoList.emit();
    this.closeModal.emit();
    this.ngOnInit();
  }

  // NAVEGACIÓN ENTRE PASOS EXPRESOS
 
  nextStep() {
    const titulo = this.recursoForm.get('titulo');
    const tipo = this.recursoForm.get('tipo');
    const categoria = this.recursoForm.get('categoria');
    

    if (titulo?.invalid || tipo?.invalid ||
      categoria?.invalid 

    ) {
      titulo?.markAsTouched();
      tipo?.markAsTouched();
      categoria?.markAsTouched();
      this.recursoForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;


  }

  
  prevStep() {
    this.currentStep = 1;
  }
  

  handleSubmit() {
    if (!this.recursoForm.valid) {
      this.recursoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { titulo, tipo } = this.recursoForm.value;

    const dataToSend = {
      usuario: this.usuario.uid,
      ...this.recursoForm.value,
    };

    if (this.recursoSeleccionado) {
      // 🔄 MODO ACTUALIZAR TEXTOS
      const data = {
        ...dataToSend,
        _id: this.recursoSeleccionado._id,
      };
      this.recursoService.updateRecurso(data).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          Swal.fire('Actualizado', `${titulo} actualizado correctamente`, 'success');
          
          // Si es tipo video, le permitimos saltar al paso 2 para actualizar el archivo si quiere
          if (tipo === 'video') {
            this.currentStep = 2;
          } else {
            this.onClose(); // Si es un banner, cerramos el asistente directo
          }
        },
        error: () => this.isLoading = false
      });
    } else {
      // 🚀 MODO CREAR REGISTRO (Paso 1)
      this.recursoService.createRecurso(dataToSend).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          this.recursoSeleccionado = resp.recurso; // Guardamos el recurso con su ID generado por Mongo
          
          if (tipo === 'video') {
            Swal.fire('¡Paso 1 completado!', 'Registro base creado con éxito. Ahora proceda a cargar su video nativo.', 'success');
            this.currentStep = 2; // Brincamos automáticamente al paso de carga de video
          } else {
            Swal.fire('¡Creado!', 'Banner guardado con éxito.', 'success');
            this.onClose();
          }
          this.cd.detectChanges();
        },
        error: () => this.isLoading = false
      });
    }
  }

  // 🎥 CAPTURA EL VIDEO Y GENERA UNA VISTA PREVIA INSTANTÁNEA [7]
  cambiarVideo(files: FileList) {
    const file = files[0];
    if (!file) {
      this.videoTemp = null;
      return;
    }

    const maxPesoBytes = 20 * 1024 * 1024;
    if (file.size > maxPesoBytes) {
      Swal.fire('Archivo muy pesado', 'El video supera el límite de 20MB. Optimízalo primero con HandBrake.', 'warning');
      this.videoTemp = null;
      return;
    }

    this.videoSubir = file;
    this.videoTemp = URL.createObjectURL(file);
  }

  // 🚀 TRANSMISIÓN HACIA NODE.JS / CLOUDINARY PARA EL REGISTRO YA EXISTENTE [7]
  subirVideo() {
    if (!this.videoSubir) {
      Swal.fire('Atención', 'Debe seleccionar un archivo de video primero', 'info');
      return;
    }

    this.cargandoVideo = true;

    this.fileUploadService
      .actualizarVideo(this.videoSubir, 'recursos', this.recursoSeleccionado._id)
      .then(resp => {
        if (resp && resp.ok) {
          // Sincronizamos la respuesta
          this.recursoSeleccionado.urlMedia = resp.url;
          this.recursoSeleccionado.cloudinary_id = resp.cloudinary_id;
          this.recursoSeleccionado.bytes = resp.bytes;

          this.cargandoVideo = false;
          this.videoTemp = null;
          
          Swal.fire('Guardado', 'El video demostrativo fue subido y enlazado con éxito', 'success');
          this.onClose(); // Finaliza el flujo completo y refresca
        } else {
          this.cargandoVideo = false;
          Swal.fire('Error', 'El servidor no pudo procesar el formato del video', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        this.cargandoVideo = false;
        Swal.fire('Error', 'No se pudo establecer conexión para subir el video', 'error');
      });
  }
}
