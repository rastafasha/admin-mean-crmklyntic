import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;

declare var bootstrap: any;

@Component({
    selector: 'app-reportar-pago',
    templateUrl: './reportar-pago.component.html',
    styleUrls: ['./reportar-pago.component.css'],
    standalone: false
})
export class ReportarPagoComponent implements OnInit, OnChanges {

  @Input() selectedPayment: Payment | null = null;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public PaymentRegisterForm: FormGroup;

  title = 'Realizar un Pago';
  isLoading: boolean = false;

  cartItems: any[] = [];
  Item: any[] = [];
  total = 0;

  public usuario;
  visible: boolean = false;

  metodo: string;
  error: string;
  pagoSeleccionado: Payment;
  pagoS: Payment;

  uploadError: boolean;
  imagePath: string;

  user: User;
  partners: User[];

  public storage = environment.mediaUrlRemoto
  clientes: Cliente;


  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private usuarioService: UserService,
    private clienteService: ClienteService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.apiUrl;
  }


  minimumPartnersValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) return null;
      const selectedCount = control.value.filter((v: any) => !!v).length;
      return selectedCount >= min ? null : { minimumPartners: { required: min, actual: selectedCount } };
    };
  }

  ngOnInit(): void {
    this.visible = false;
    this.validarFormulario();
    this.total = this.getTotal();
    this.getClientes();
    this.getPartners();

  }
  getClientes() {
    this.clienteService.getClientes().subscribe((resp: any) => {
      this.clientes = resp;
    })
  }

  getPartners() {
    this.usuarioService.cargarUsuarios().subscribe((resp: any) => {
      this.partners = resp.usuarios;
      // console.log(this.partners)
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
    const validatedArray = this.fb.array(partnersFormArray.value, this.minimumPartnersValidator(3));
    this.PaymentRegisterForm.setControl('partners', validatedArray);
  }


  getTotal(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.quantity * item.productPrice;
    });
    return +total.toFixed(2);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedPayment'] &&
      changes['selectedPayment'].currentValue
    ) {
      const payment = changes['selectedPayment'].currentValue;
      this.setPartnersFormArray(payment.partners);
      this.PaymentRegisterForm.patchValue({
        id: payment._id,
        cliente: payment.cliente?._id || payment.cliente, // Por si viene populado
        amount: payment.amount,
        tipo_pago: payment.tipo_pago,
        metodo_pago: payment.metodo_pago,
        referencia: payment.referencia,
        bank_destino: payment.bank_destino,
        fecha_verificacion: payment.fecha_verificacion,
        status: payment.status,
        // Cargamos los IDs de la repartición guardada
        vendedorId: payment.reparticion?.vendedor?.id,
        adminId: payment.reparticion?.admin?.id,
        ceoId: payment.reparticion?.ceo?.id
      });
      this.title = 'Editando Pago';
    }
  }
  validarFormulario() {
    this.PaymentRegisterForm = this.fb.group({
      partners: this.fb.array([], this.minimumPartnersValidator(3)),
      id: [''],
      cliente: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]], // Validar que sea número > 0
      tipo_pago: ['', Validators.required],
      referencia: ['', Validators.required],
      metodo_pago: ['', Validators.required],
      bank_destino: ['', Validators.required],
      fecha_verificacion: [new Date(), Validators.required],
      status: [false],
      // Campos ocultos o automáticos para la repartición
      // partners: ['', Validators.required],
      vendedorId: ['', Validators.required],
      adminId: ['', Validators.required],
      ceoId: ['', Validators.required]
    })
  }



  handleSubmit() {

    if (!this.PaymentRegisterForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.PaymentRegisterForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    // 1. Convertimos los booleanos [true, false...] en objetos de usuario reales
    const usuariosSeleccionados = this.PaymentRegisterForm.value.partners
      .map((checked: boolean, i: number) => checked ? this.partners[i] : null)
      .filter((u: any) => u !== null);

    // 2. Buscamos quién cumple cada rol dentro de los seleccionados
    const vendedor = usuariosSeleccionados.find(u => u.role === 'PARTNER');
    const administrador = usuariosSeleccionados.find(u => u.role === 'ADMIN');
    const ceo = usuariosSeleccionados.find(u => u.role === 'SUPERADMIN');

    // 3. Construimos el objeto FINAL que espera el Backend
    const dataToBackend = {
      // Traemos todo lo del formulario
      ...this.PaymentRegisterForm.value,
      // Sobrescribimos con los valores procesados y limpios
      amount: Number(this.PaymentRegisterForm.get('amount').value),
      vendedorId: vendedor ? vendedor.uid : null,
      adminId: administrador ? administrador.uid : null,
      ceoId: ceo ? ceo.uid : null,
      // Limpiamos el campo partners para que no envíe [true, false]
      partners: usuariosSeleccionados.map(u => u.uid),
    };

    // DEBUG: Revisa esto en la consola para confirmar que ahora sí van los IDs
    console.log('Datos listos para enviar:', dataToBackend);


    if (this.selectedPayment) {
      //actualizar
      this.paymentService.updatePayment(this.selectedPayment._id, dataToBackend).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('reportarPagoModal');
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

      this.paymentService.createPayment(dataToBackend)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `creado correctamente`, 'success');

          const modalElement = document.getElementById('reportarPagoModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
          // Emit event to refresh project list
          this.refreshProjectList.emit();
          // this.enviarNotificacion();
          this.ngOnInit();
          this.closeModal.emit();
        });

    }



  }



  onClose() {
    this.selectedPayment = null;
    this.PaymentRegisterForm.reset();
    this.title = 'Creando Proyecto';
    // Also reset default values if needed
    this.PaymentRegisterForm.patchValue({
      status: false,
      hasVisited: false,
      hasMenu: false,
      notificado: false
    });
    // Emit event to parent to reset the projectSeleccionado variable
    this.closeModal.emit();
  }



}
