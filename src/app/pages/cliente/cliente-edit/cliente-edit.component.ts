import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Pais } from 'src/app/models/pais.model';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { ClienteService } from 'src/app/services/cliente.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
    selector: 'app-cliente-edit',
    templateUrl: './cliente-edit.component.html',
    styleUrls: ['./cliente-edit.component.css'],
    standalone: false
})
export class ClienteEditComponent implements OnInit, OnChanges {

  @Input() clienteSeleccionado;
  @Output() refreshClientList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  clienteForm: FormGroup;
  title: string;
  usuario: User;
  partners: User[];
  cliente: Cliente;
  id: string;
  categorias: Speciality[];
  paises: Pais;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private clienteService: ClienteService,
    private paisService: PaisService,
    private categoryService: SpecialityService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.apiUrl;
  }

  ngOnInit(): void {
    this.validarFormulario();
    this.getCategorias();
    this.getPartners();
    this.getPaises();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['clienteSeleccionado'] &&
      changes['clienteSeleccionado'].currentValue
    ) {
      const cliente = changes['clienteSeleccionado'].currentValue;
      this.setPartnersFormArray(cliente.partners);
      this.clienteForm.patchValue({
        id: cliente._id,
        name: cliente.name,
        url: cliente.url,
        rrss: cliente.rrss,
        category: cliente.category._id,
        ubicacion: cliente.ubicacion,
        pais: cliente.pais._id,
        hasVisited: cliente.hasVisited,
        dateTest: cliente.dateTest,
        dateInicio: cliente.dateInicio,
        status: cliente.status,
      });
      this.title = 'Editando Cliente';
      this.clienteSeleccionado = cliente;
    }
  }

  getCategorias() {
    this.categoryService.getSpecialities().subscribe((resp: any) => {
      // console.log(resp);
      this.categorias = resp;
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
    this.clienteForm.setControl('partners', partnersFormArray);
  }

  validarFormulario() {
    this.clienteForm = this.fb.group({
      name: ['', Validators.required],
      url: [''],
      rrss: ['', Validators.required],
      category: ['', Validators.required],
      ubicacion: ['', Validators.required],
      pais: ['', Validators.required],
      dateTest: [''],
      dateInicio: [''],
      status: [false],
      partners: this.fb.array([],),
      // img: [''],
      id: [''],
    });
  }

  cargarProject(_id: string) {
    if (_id !== null && _id !== undefined) {
      this.title = 'Editando Cliente';
      this.clienteService.getCliente(_id).subscribe((res) => {
        this.clienteForm.patchValue({
          id: res._id,
          name: res.name,
          url: res.url,
          rrss: res.rrss,
          category: res.category._id,
          pais: res.pais._id,
          dateTest: res.dateTest,
          dateInicio: res.dateInicio,
          status: res.status,
          ubicacion: res.ubicacion,
          partners: res.partners,
        });
        this.clienteSeleccionado = res;
      });
    } else {
      this.title = 'Creando Cliente';
    }
  }

  onClose() {
    this.clienteSeleccionado = null;
    this.clienteForm.reset();
    this.title = 'Creando Cliente';
    // Also reset default values if needed
    this.clienteForm.patchValue({
      status: false,
    });
    // Emit event to parent to reset the clienteSeleccionado variable
    this.closeModal.emit();
  }


  handleSubmit() {
    if (!this.clienteForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.clienteForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { nombre } = this.clienteForm.value;

    // const formData = new FormData();
    // formData.append('name', this.clienteForm.value.name);
    // formData.append('url', this.clienteForm.value.url);
    // if (this.clienteForm.value.category) {
    //   formData.append('category', this.clienteForm.value.category);
    // }

    // if (this.clienteForm.value.hasVisited) {
    //   formData.append('hasVisited', this.clienteForm.value.hasVisited);
    // }
    // if (this.clienteForm.value.dateVista) {
    //   formData.append('dateVista', this.clienteForm.value.dateVista);
    // }
    // if (this.clienteForm.value.type) {
    //   formData.append('type', this.clienteForm.value.type);
    // }
    // if (this.FILE_AVATAR) {
    //   formData.append('imagen', this.FILE_AVATAR);
    // }

    // Extract selected partner IDs from the FormArray
    const selectedPartners = this.clienteForm.value.partners
      .map((checked, i) => (checked ? this.partners[i].uid : null))
      .filter((v) => v !== null);

    const dataToSend = {
      ...this.clienteForm.value,
      // formData,
      partners: selectedPartners,
    };

    if (this.clienteSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.clienteSeleccionado._id,
      };
      this.clienteService.updateCliente(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${name}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editCliente');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshClientList.emit();
        this.ngOnInit()
      });
    } else {
      //crear
      this.clienteService.createCliente(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        Swal.fire('Creado', `${name} creado correctamente`, 'success');
        // Close modal programmatically
        const modalElement = document.getElementById('editCliente');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
        // Emit event to refresh project list
        this.refreshClientList.emit();
        // this.enviarNotificacion();
        this.ngOnInit()
      });
    }
  }

}
