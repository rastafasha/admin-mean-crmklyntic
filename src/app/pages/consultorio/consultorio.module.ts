import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfModule } from '../conf/conf.module';
import { ConsultorioListComponent } from './consultorio-list/consultorio-list.component';
import { ConsultorioEditComponent } from './consultorio-edit/consultorio-edit.component';



@NgModule({
  declarations: [
    ConsultorioListComponent,
    ConsultorioEditComponent
  ],
  exports: [
    ConsultorioListComponent,
    ConsultorioEditComponent
  ],
  imports: [CommonModule,
          SharedModule,
          ReactiveFormsModule,
          FormsModule,
          RouterModule,
          PipesModule,
          ConfModule,
          ComponentsModule,
          NgxPaginationModule], 
  providers: 
          [provideHttpClient(withInterceptorsFromDi())] 
})
export class ConsultorioModule { }
