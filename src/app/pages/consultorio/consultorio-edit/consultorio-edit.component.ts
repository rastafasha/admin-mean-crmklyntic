import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Consultorio } from 'src/app/models/consultorio';
import { Pais } from 'src/app/models/pais.model';
import { Speciality } from 'src/app/models/speciality';
import { User } from 'src/app/models/user';
import { ConsultorioService } from 'src/app/services/consultorio.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var bootstrap: any;

// Definimos la estructura de cada fila
interface ItemMedico {
  descripcion: string;
  precio: string;
}
@Component({
  selector: 'app-consultorio-edit',
  standalone:false,
  templateUrl: './consultorio-edit.component.html',
  styleUrl: './consultorio-edit.component.css'
})
export class ConsultorioEditComponent {


  @Input() consultorioSeleccionado;
  @Output() refreshClientList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  clienteForm: FormGroup;
  title: string;
  usuario: User;
  partners: User[];
  consultorii: Consultorio;
  id: string;
  categorias: Speciality[];
  paises: Pais;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  // 📦 Listados dinámicos estructurados con Objetos
  serviciosArray: ItemMedico[] = [];
  tarifasArray: ItemMedico[] = [];
  vacunasArray: ItemMedico[] = [];

  // Inputs independientes separados para la UI
  tempServicioDesc: string = '';
  tempServicioPrecio: string = '';

  tempTarifaDesc: string = '';
  tempTarifaPrecio: string = '';

  tempVacunaDesc: string = '';
  tempVacunaPrecio: string = '';

  isLoading: boolean = false;
currentStep = 1;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private consultorioService: ConsultorioService,
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
    console.log(this.consultorioSeleccionado)
  }

    ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['consultorioSeleccionado'] &&
      changes['consultorioSeleccionado'].currentValue
    ) {
      const cliente = changes['consultorioSeleccionado'].currentValue;
      
      // 1. Cargamos el FormArray de los usuarios asignados/colaboradores (Mantiene tu lógica nativa)
      this.setPartnersFormArray(cliente.partners);

      // 2. Hidratamos de forma instantánea los arreglos visuales en memoria (Para las tablas tipo medicamento)
      // Usamos el operador de coalescencia nula (|| []) para evitar que rompa si es un registro viejo
      this.tarifasArray = cliente.ConsultasyTarifasList || [];
      this.serviciosArray = cliente.Servicios_procedimientosList || [];
      this.vacunasArray = cliente.vacunasList || [];

      // 3. Inyectamos la data completa dentro del formulario reactivo
      this.clienteForm.patchValue({
        id: cliente._id,
        name: cliente.name,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        slug: cliente.slug,
        user_id: cliente.user_id,
        
        // Ubicación y Contacto sincronizados con Mongoose
        phone: cliente.phone,
        rrss: cliente.rrss,
        ciudad: cliente.ciudad,
        address: cliente.address,
        tipoClinica: cliente.tipoClinica,
        url: cliente.url,

        // 🛡️ NAVEGACIÓN SEGURA PARA RELACIONES: Evita errores de consola si vienen como ID o como Objeto completo
        category: cliente.category?._id || cliente.category || '',
        pais: cliente.pais?._id || cliente.pais || '',

        // Control Comercial y Estados Administrativos del CRM
        dateTest: cliente.dateTest,
        dateInicio: cliente.dateInicio,
        status: cliente.status || 'Activo',
        statusapp: cliente.statusapp || 'PENDIENTE',
        planSuscripcion: cliente.planSuscripcion || 'GRATIS',
        moneda: cliente.moneda || 'USD',

        // 🏥 COLOVACIÓN DE LAS LISTAS DINÁMICAS DE OBJETOS EXPRESS
        usavacunas: cliente.usavacunas || false,
        ConsultasyTarifasList: this.tarifasArray,
        Servicios_procedimientosList: this.serviciosArray,
        vacunasList: this.vacunasArray,
        HorariodeAtencion: cliente.HorariodeAtencion || '',
      });

      this.title = 'Editando Consultorio';
      this.consultorioSeleccionado = cliente;
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
    rrss: [''],
    ciudad: ['', Validators.required],
    url: [''],
    category: ['', Validators.required],
    pais: ['', Validators.required],
    
    // 🔥 CORRECCIÓN 1: 'address' debe coincidir milimétricamente con tu HTML
    address: ['', Validators.required], 
    
    dateTest: ['', Validators.required],
    dateInicio: ['', Validators.required],
    tipoClinica: ['', Validators.required], // Captura el select de Consultorio/Clínica

    // 🔒 CAMPOS OCULTOS (Vienen heredados del Doctor seleccionado del CRM)
    slug: [''],    // Quitamos 'Validators.required' aquí para que no tranque si se genera en el backend
    user_id: [''], // Se llena automáticamente al cargar el prospecto
    id: [''],

    // 🏥 CONTROLES DE LA APP DE RESERVAS EXPRESS
    usavacunas: [false, Validators.required],
    HorariodeAtencion: [''],

    // Inicializados como arreglos vacíos nativos
    Servicios_procedimientosList: [[]],
    ConsultasyTarifasList: [[]],
    vacunasList: [[]]
  });
}



// =========================================================================
  // ➕ FUNCIONES PARA AGREGAR CON DESCRIPCIÓN Y PRECIO SEPARADOS
  // =========================================================================
  agregarServicio() {
    if (this.tempServicioDesc.trim()) {
      this.serviciosArray.push({
        descripcion: this.tempServicioDesc.trim(),
        precio: this.tempServicioPrecio.trim() || 'N/A'
      });
      this.tempServicioDesc = '';
      this.tempServicioPrecio = '';
      this.actualizarValorFormulario('Servicios_procedimientosList', this.serviciosArray);
    }
  }

  agregarTarifa() {
    if (this.tempTarifaDesc.trim()) {
      this.tarifasArray.push({
        descripcion: this.tempTarifaDesc.trim(),
        precio: this.tempTarifaPrecio.trim() || 'Free'
      });
      this.tempTarifaDesc = '';
      this.tempTarifaPrecio = '';
      this.actualizarValorFormulario('ConsultasyTarifasList', this.tarifasArray);
    }
  }

  agregarVacuna() {
    if (this.tempVacunaDesc.trim()) {
      this.vacunasArray.push({
        descripcion: this.tempVacunaDesc.trim(),
        precio: this.tempVacunaPrecio.trim() || 'N/A'
      });
      this.tempVacunaDesc = '';
      this.tempVacunaPrecio = '';
      this.actualizarValorFormulario('vacunasList', this.vacunasArray);
    }
  }

  // =========================================================================
  // ❌ REMOVER ELEMENTOS
  // =========================================================================
  removerServicio(index: number) {
    this.serviciosArray.splice(index, 1);
    this.actualizarValorFormulario('Servicios_procedimientosList', this.serviciosArray);
  }

  removerTarifa(index: number) {
    this.tarifasArray.splice(index, 1);
    this.actualizarValorFormulario('ConsultasyTarifasList', this.tarifasArray);
  }

  removerVacuna(index: number) {
    this.vacunasArray.splice(index, 1);
    this.actualizarValorFormulario('vacunasList', this.vacunasArray);
  }

  // Formatea el objeto para guardarlo ordenadamente como texto en MongoDB
  private actualizarValorFormulario(controlName: string, arrayData: ItemMedico[]) {
  // Pasamos el array de objetos directamente, sin transformarlo a texto plano
  this.clienteForm.get(controlName)?.setValue(arrayData); 
  this.clienteForm.get(controlName)?.updateValueAndValidity();
}


   cargarProject(_id: string) {
    if (_id !== null && _id !== undefined) {
      this.title = 'Editando Consultorio';
      this.isLoading = true;

      this.consultorioService.getConsultorio(_id).subscribe({
        next: (res: any) => {
          this.consultorioSeleccionado = res;

          // 1. Sincronizamos los arrays visuales en memoria (Para la UI con botones e inputs separados)
          // Usamos el operador ternario || [] por seguridad, en caso de que sea un registro viejo sin estos campos
          this.tarifasArray = res.ConsultasyTarifasList || [];
          this.serviciosArray = res.Servicios_procedimientosList || [];
          this.vacunasArray = res.vacunasList || [];

          // 2. Cargamos los datos limpios en los inputs correspondientes del formulario reactivo
          this.clienteForm.patchValue({
            // Mantenemos tus campos estructurales e identitarios nativos
            name: res.name,
            nombre: res.nombre,
            apellido: res.apellido,
            slug: res.slug,
            rrss: res.rrss,
            tipoClinica: res.tipoClinica,
            
            // 🛡️ CONTROL SEGURO DE PAÍS: Evita que la app se cuelgue si res.pais viene vacío
            pais: res.pais?._id || res.pais || '', 
            
            dateTest: res.dateTest,
            dateInicio: res.dateInicio,
            status: res.status,
            statusapp: res.statusapp,
            planSuscripcion: res.planSuscripcion,
            moneda: res.moneda || 'USD',
            
            // Contacto y Ubicación acoplados a tu Mongoose
            address: res.address,
            ciudad: res.ciudad,
            phone: res.phone,

            // 🏥 VINCULACIÓN MAESTRA DE LOS CAMPOS SAAS EXPRESS CON SUS ARRAYS NATIVOS
            usavacunas: res.usavacunas || false,
            ConsultasyTarifasList: this.tarifasArray,
            Servicios_procedimientosList: this.serviciosArray,
            vacunasList: this.vacunasArray,
            HorariodeAtencion: res.HorariodeAtencion || '',
            
            partners: res.partners?._id || res.partners,
          });

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Error al cargar los datos del consultorio en el CRM:', err);
        }
      });
    } else {
      this.title = 'Creando Consultorio';
      this.consultorioSeleccionado = null;
      
      // Limpieza absoluta de la memoria al cambiar a modo "Crear" para evitar residuos visuales
      this.tarifasArray = [];
      this.serviciosArray = [];
      this.vacunasArray = [];
      this.clienteForm.reset({
        usavacunas: false,
        moneda: 'USD',
        planSuscripcion: 'GRATIS',
        status: 'Activo',
        statusapp: 'PENDIENTE'
      });
    }
  }


  onClose() {
    this.consultorioSeleccionado = null;
    this.clienteForm.reset();
    this.title = 'Creando Consultorio';
    // Also reset default values if needed
    this.clienteForm.patchValue({
      status: false,
    });
    // Emit event to parent to reset the consultorioSeleccionado variable
    this.closeModal.emit();
  }


  nextStep() {
    
    this.currentStep = 2;
  }

  prevStep2() {
    this.currentStep = 1;
  }

 handleSubmit() {
  // 1. Sincronizamos los arrays de objetos nativos acumulados en las tablas con el formulario de Angular
  this.clienteForm.get('ConsultasyTarifasList')?.setValue(this.tarifasArray);
  this.clienteForm.get('Servicios_procedimientosList')?.setValue(this.serviciosArray);
  this.clienteForm.get('vacunasList')?.setValue(this.vacunasArray);

  // 2. VALIDACIÓN MANUAL DE SEGURIDAD EXCLUSIVA PARA EL SAAS EXPRESS
  if (this.tarifasArray.length === 0) {
    Swal.fire('Faltan Datos', 'Por favor, agregue al menos una Consulta y Tarifa en la pestaña 2.', 'warning');
    return;
  }

  if (this.serviciosArray.length === 0) {
    Swal.fire('Faltan Datos', 'Por favor, agregue al menos un Servicio y Procedimiento en la pestaña 2.', 'warning');
    return;
  }

  // 3. Verificamos la validez de todos los inputs del formulario reactivo
  if (!this.clienteForm.valid) {
    // Marcamos todo como tocado para que los mensajes rojos de "Campo Requerido" aparezcan en pantalla
    this.clienteForm.markAllAsTouched();
    
    // Imprimimos en consola qué campo exacto está fallando para que puedas auditarlo rápido
    console.log('❌ Campos inválidos detectados:', this.findInvalidControls());
    
    Swal.fire('Formulario Incompleto', 'Por favor, revise los campos obligatorios marcados en rojo en la pestaña 1 o 2.', 'error');
    return;
  }

  this.isLoading = true;
  const dataToSend = {
    ...this.clienteForm.value,
  };

  const nombreConsultorio = this.clienteForm.get('name')?.value || 'Consultorio';

  if (this.consultorioSeleccionado) {
    // =======================================================================
    // ACCIÓN: ACTUALIZAR EN MONGODB
    // =======================================================================
    const data = {
      ...dataToSend,
      _id: this.consultorioSeleccionado._id,
    };

    this.consultorioService.updateConsultorio(data).subscribe({
      next: (resp) => {
        this.isLoading = false;
        Swal.fire('Actualizado', `"${nombreConsultorio}" actualizado correctamente`, 'success');
        this.cerrarModalProgramatico();
        this.refreshClientList.emit();
        this.ngOnInit();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron actualizar los datos en Render.', 'error');
      }
    });

  } else {
    // =======================================================================
    // ACCIÓN: CREAR EN MONGODB
    // =======================================================================
    this.consultorioService.createConsultorio(dataToSend).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        Swal.fire('Creado', `"${nombreConsultorio}" creado correctamente`, 'success');
        this.cerrarModalProgramatico();
        this.refreshClientList.emit();
        this.ngOnInit();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'Fallo al guardar el consultorio Express.', 'error');
      }
    });
  }
}

/**
 * Función de auditoría: Te dice exactamente qué inputs están fallando en tu consola (F12)
 */
private findInvalidControls() {
  const invalid = [];
  const controls = this.clienteForm.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

private cerrarModalProgramatico() {
  const modalElement = document.getElementById('editConsultorio');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  }
}



}
