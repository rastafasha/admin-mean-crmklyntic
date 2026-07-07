import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css'],
    standalone: false
})
export class PaymentsComponent implements OnInit {

  @Input() displaycomponent: string = 'block';

  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;

  selectedPayment: Payment;
  title = 'Pagos';

  payments: Payment[];
  error: string;
  p: number = 1;
  count: number = 8;
  isLoading: boolean

  public usuario;
  query: string = '';

  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private userService: UserService,
    private http: HttpClient
  ) {
    let USER = localStorage.getItem('user');
    this.usuario = JSON.parse(USER ? USER : '');
  }

  ngOnInit(): void {

    window.scrollTo(0, 0);
    this.getPagos();
  }



  getPagos(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe((res: any) => {
      this.payments = res;
      (error) => (this.error = error);
      this.isLoading = false;
      // console.log(this.payments);
    });
  }
  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  search() {
    // return this.paymentService.search(this.query).subscribe((res: any) => {
    //   this.payments = res;
    //   if (!this.query) {
    //     this.ngOnInit();
    //   }
    // });
  }

  public PageSize(): void {
    this.getPagos();
    this.query = '';
  }

  cambiarStatus(data: any) {
    const VALUE = data.status;
    console.log(VALUE);

    this.paymentService.updatePaymentStatus(data).subscribe(
      resp => {

        console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getPagos();
      }
    )
  }

  onEditPayment(payment: Payment) {
      this.selectedPayment = payment;
    }

  openEditModal(): void {
    this.selectedPayment = null;
  }

  refreshPayments(): void {
    this.getPagos();
  }

  closeReportarModal(): void {
    const modal = document.getElementById('reportarPagoModal');
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    this.selectedPayment = null;
  }

  onCloseModal(): void {
    this.selectedPayment = null;
  }

  onDeletePayment(payment: Payment) {
      this.selectedPayment = payment;
  
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
          this.paymentService.deletePayment(payment._id).subscribe((resp: any) => {
            this.getPagos();
          })
          Swal.fire(
            'Borrado!',
            'El Archivo fue borrado.',
            'success'
          )
          this.ngOnInit();
        }
      });
  
    }

    optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
  }
}
