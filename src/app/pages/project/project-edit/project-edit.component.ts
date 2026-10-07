import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  projectExiste = false;
  public whatsappBackupLink: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private authService: AuthService,
    private projectService: DoctorService,
    private paisService: PaisService,
    private categoryService: SpecialityService,
    private fileUploadService: FileUploadService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
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
        nombre: project.nombre,
        apellido: project.apellido,
        email: project.email,
        slug: project.slug,
        phone: project.phone,
        url: project.url,
        rrss: project.rrss,
        speciality: project.speciality._id,
        ubicacion: project.ubicacion,
        pais: project.pais._id,
        hasVisited: project.hasVisited,
        negociacion: project.negociacion,
        propuesta: project.propuesta,
        dateVisita: project.dateVisita,
        dateAprobado: project.dateAprobado,
        tipoClinica: project.tipoClinica,
        notificado: project.notificado,
        status: project.status,
        statusapp: project.statusapp,
        hasLaboratory: project.hasLaboratory,
        estado_seguimiento: project.estado_seguimiento,
        canal_origen: project.canal_origen,
        correo_enviado: project.correo_enviado,
        correo_sendit: project.correo_sendit,
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
    // this.projectForm.setControl('partners', partnersFormArray);
  }

  validarFormulario() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      nombre: [''],
      apellido: [''],
      url: [''],
      slug: [''],
      phone: [''],
      rrss: [''],
      speciality: ['', Validators.required],
      tipoClinica: ['', Validators.required],
      ubicacion: ['', Validators.required],
      pais: ['', Validators.required],
      dateVisita: [''],
      dateAprobado: [''],
      negociacion: [''],
      propuesta: [''],
      estado_seguimiento: ['PENDIENTE'],
      statusapp: ['PENDIENTE'],
      email: [''],
      canal_origen: [''],
      correo_enviado: [''],
      correo_sendit: [false],
      status: [false],
      hasVisited: [false],
      notificado: [false],
      hasLaboratory: [false],
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
      nombre: null,
      apellido: null,
      url: null,
      slug: null,
      phone: null,
      rrss: null,
      category: null,
      tipoClinica: null,
      ubicacion: null,
      pais: null,
      dateVisita: null,
      dateAprobado: null,
      negociacion: null,
      propuesta: null,
      status: [false],
      correo_sendit: [false],
      hasVisited: [false],
      notificado: [false],
      partners: null,
      estado_seguimiento: null,
      email: null,
      canal_origen: null,
      correo_enviado: null,
      img: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.whatsappBackupLink = ''; // 👈 Limpieza
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
    const phone = this.projectForm.get('phone');
    const category = this.projectForm.get('category');
    const pais = this.projectForm.get('pais');
    const ubicacion = this.projectForm.get('ubicacion');
    const tipoClinica = this.projectForm.get('tipoClinica');
    const dateVisita = this.projectForm.get('dateVisita');
    const dateAprobado = this.projectForm.get('dateAprobado');
    const hasVisited = this.projectForm.get('hasVisited');

    if (name?.invalid || url?.invalid ||
      phone?.invalid || category?.invalid ||
      pais?.invalid || ubicacion?.invalid ||
      tipoClinica?.invalid ||
      dateVisita?.invalid ||
      dateAprobado?.invalid ||
      hasVisited?.invalid

    ) {
      name?.markAsTouched();
      url?.markAsTouched();
      phone?.markAsTouched();
      category?.markAsTouched();
      pais?.markAsTouched();
      ubicacion?.markAsTouched();
      tipoClinica?.markAsTouched();
      dateVisita?.markAsTouched();
      dateAprobado?.markAsTouched();
      hasVisited?.markAsTouched();
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;


  }

  nextStep3() {
    this.currentStep = 3;
  }

  prevStep() {
    this.currentStep = 1;
  }
  prevStep2() {
    this.currentStep = 2;
  }


  verificarProject(event: any): void {
    const documento = event.target.value?.trim();
    const control = this.projectForm.get('name');

    // 1. Si está vacío o tiene menos de 3 caracteres, limpiamos el error 'yaExiste'
    // y dejamos que Angular ejecute sus validadores nativos normales.
    if (!documento || documento.length < 3) {
      this.projectExiste = false;
      if (control?.hasError('yaExiste')) {
        delete control.errors?.['yaExiste'];
        control.updateValueAndValidity(); // 👈 Fuerza a Angular a recalcular required/minlength
      }
      return;
    }

    // 2. Consultamos al backend si pasa los filtros básicos
    this.projectService.veriificarExistencia(documento).subscribe({
      next: (res: any) => {
        const control = this.projectForm.get('name');

        if (res && res.exists) {
          this.projectExiste = true;

          // Conservamos errores previos y sumamos 'yaExiste'
          const erroresActuales = control?.errors || {};
          control?.setErrors({ ...erroresActuales, yaExiste: true });

          // CORREGIDO: Usamos onlySelf en lugar del error de tipeo
          control?.markAsTouched({ onlySelf: true });
          control?.markAsDirty();
        } else {
          this.projectExiste = false;
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
        this.projectForm.updateValueAndValidity();
        this.cd.detectChanges(); // 👈 LA LÍNEA MÁGICA: Fuerza a Angular a pintar el HTML ya mismo
      },
      error: (err) => {
        console.error("Error al verificar el documento", err);
      }
    });
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
        // 🟢 INYECCIÓN DE TU LÓGICA EXPRESS ADAPTADA AL CRM
        // Si el backend nos avisa que el webhook falló (devolviendo la bandera o el link de escape)
        if (resp && resp['whatsapp_link']) {
          
          // 1. Extraemos los datos reales del médico recién actualizado
          const doctorData = this.projectSeleccionado;
          const nombreDoctor = `${doctorData.nombre || ''} ${doctorData.apellido || ''}`.trim() || this.projectSeleccionado.name;
          const telefonoDoctor = doctorData.phone ? String(doctorData.phone).replace(/[^\d]/g, '') : '';
          const correoDoctor = doctorData.email || '';
          
          // Estructuramos el subdominio de acceso según el tipo de clínica (Enterprise o Express)
          const esEnterprise = doctorData.tipoClinica === 'Clínica' || doctorData.tipoClinica === 'Clinica';
          const urlAcceso = `https://${doctorData.slug || 'centro-medico'}.${esEnterprise ? 'admin.' : ''}klyntic.com`;

          // 2. Estructuramos tu plantilla de texto plano comercial
          const mensajeBot = 
            `✨ *KLYNTIC CONSULTORIO DIGITAL* ✨\n\n` +
            `👋 ¡Hola Dr(a). ${nombreDoctor}! Su acceso a la plataforma ya se encuentra activo y configurado.\n\n` +
            `🔗 *Enlace Privado:* ${urlAcceso}\n` +
            `📧 *Usuario de Ingreso:* ${correoDoctor}\n` +
            `📧 *Contraseña:* ${telefonoDoctor}\n\n` +
            `Cualquier duda o asistencia con la configuración inicial de sus agendas me avisa. 🚀`;

          // 3. Armamos la URL limpia usando tu formato nativo wa.me sin codificaciones dobles
          if (telefonoDoctor) {
            this.whatsappBackupLink = `https://wa.me/${telefonoDoctor}?text=${encodeURIComponent(mensajeBot)}`;
          }
        }
        const project_name = this.projectForm.get('name')?.value || 'Médico';

        // 🟢 CASO A: Si el Webhook falló y tenemos el link de escape listo
        if (this.whatsappBackupLink) {
          Swal.fire({
            title: '¡Actualizado con éxito! 🚀',
            html: `
              <p>Los datos de <strong>${project_name}</strong> se guardaron correctamente.</p>
              <p style="font-size: 14px; color: #666;">El envío automático falló o está encolado. Despacha las credenciales manualmente:</p>
              <!-- Al ser un enlace wa.me limpio, Angular lo renderiza perfecto sin activar alertas de XSS -->
              <a href="${this.whatsappBackupLink}" 
                 target="_blank" 
                 class="swal2-confirm swal2-styled" 
                 style="background-color: #25D366; color: white; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(37,211,102,0.3); margin-top: 10px;">
                 <i class="bi bi-whatsapp"></i> Enviar Accesos por WhatsApp
              </a>
            `,
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Cerrar Ventana',
            confirmButtonColor: '#6c757d' // Color gris neutral para el botón de cerrar de Swal
          }).then(() => {
            // Cuando cierren el Swal, ejecutamos la limpieza y cierre del modal de Bootstrap de forma segura
            this.ejecutarCierreYRefresco();
          });
        }
        // ⚪ CASO B: Si todo salió perfecto en piloto automático por Render
        else {
          Swal.fire(
            'Actualizado',
            `"${project_name}" actualizado correctamente por el sistema.`,
            'success'
          ).then(() => {
            this.ejecutarCierreYRefresco();
          });
        }

        // 🟢 CLAVE: Si se generó el link de respaldo, NO cerramos el modal de golpe
        // para permitirte presionar el botón verde en la pantalla.
        if (this.whatsappBackupLink) {
          console.log('📲 Link de escape listo. El modal se mantiene abierto para el envío manual.');
          this.refreshProjectList.emit(); // Refrescamos la lista de fondo de todos modos
          return; // Cortamos la ejecución aquí
        }

        // Si NO hay link (todo salió automático), cerramos el modal de forma normal
        const modalElement = document.getElementById('editProject');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }

        this.refreshProjectList.emit();
        this.ngOnInit();
      });
    } else {
      //crear
      this.projectService.createDoctor(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        // 🟢 Guardamos lo que viene del backend (whatsapp_link) en tu variable de Angular (whatsappBackupLink)
        if (resp && resp['whatsapp_link']) {
          this.whatsappBackupLink = resp['whatsapp_link'];
        }
        this.projectSeleccionado = resp;
        Swal.fire('¡Paso 1 completado!', 'Tienda creada. Ahora Agrega la info para el menu y sube la imagen.', 'success');
        this.currentStep = 2;
      });
    }
  }

  private ejecutarCierreYRefresco() {
    // Ocultamos el modal de Bootstrap programáticamente sin colisiones visuales
    const modalElement = document.getElementById('editProject');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Refrescamos la lista de la tabla de fondo y reiniciamos el formulario
    this.refreshProjectList.emit();
    this.ngOnInit();
    this.whatsappBackupLink = ''; // Limpiamos el link de la memoria
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
      .actualizarFoto(this.imagenSubir, 'doctors', this.projectSeleccionado._id)
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
