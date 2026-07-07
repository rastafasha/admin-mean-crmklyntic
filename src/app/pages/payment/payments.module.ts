import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PaymentsComponent } from './payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReportarPagoComponent } from './reportar-pago/reportar-pago.component';



@NgModule({ declarations: [
        PaymentDetailsComponent,
        PaymentsComponent,
        ReportarPagoComponent
    ],
    exports: [
        PaymentDetailsComponent,
        PaymentsComponent,
        ReportarPagoComponent
    ], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BrowserAnimationsModule,
        NgxPaginationModule,
        SharedModule,
        PipesModule,
        ComponentsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class PaymentsModule { }
