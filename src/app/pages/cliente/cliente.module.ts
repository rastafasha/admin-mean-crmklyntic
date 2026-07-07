import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteEditComponent } from './cliente-edit/cliente-edit.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfModule } from '../conf/conf.module';



@NgModule({ declarations: [
        ClientesListComponent,
        ClienteEditComponent
    ],
    exports: [
        ClientesListComponent,
        ClienteEditComponent
    ], imports: [CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        PipesModule,
        ConfModule,
        ComponentsModule,
        NgxPaginationModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ClienteModule { }
