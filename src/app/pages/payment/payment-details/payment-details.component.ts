import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['./payment-details.component.css'],
    standalone: false
})
export class PaymentDetailsComponent implements OnInit {
@Input() displaycomponent: string = 'block';
  title = "Detalle Pago";
  payment: Payment;
  error: string;
  student_id: number;
  parent_id: number;
  isLoading: boolean = false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe(({ id }) => this.getPagoById(id));
  }
  getUser(id: number) {
    this.paymentService.getByUser(id).subscribe(
      res => {
        this.payment = res;
        error => this.error = error
        // console.log(this.payment);
      }
    );
  }

  getPagoById(id: any) {
    this.isLoading = true;
    this.paymentService.getPayment(id).subscribe(
      res => {
        this.payment = res;
        console.log(this.payment);
        this.isLoading = false;
        // this.getParent();
        // this.getStudent();
      }

    )
  }
  // getParent(){
  //   this.parentService.getUserById(this.parent_id).subscribe((resp:any)=>{
  //     console.log(resp);
  //     this.parent = resp.representante;

  //   })
  // }
  // getStudent(){
  //   this.studentService.getUserById(this.student_id).subscribe((resp:any)=>{
  //     console.log(resp);
  //     this.student = resp.student;
  //   })
  // }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
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
        this.ngOnInit();
      }
    )
  }

}
