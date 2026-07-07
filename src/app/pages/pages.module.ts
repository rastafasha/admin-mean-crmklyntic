import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//modulos

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//helpers
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import {PagesComponent} from './pages.component';
import { ConfModule } from './conf/conf.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';

// paginacion
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

//componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';

import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProjectModule } from './project/project.module';
import { ClienteModule } from './cliente/cliente.module';
import { PaymentsModule } from './payment/payments.module';

@NgModule({ declarations: [
        DashboardComponent,
        DashboardAdminComponent,
        PagesComponent,
        ProfileComponent,
        UsersComponent,
        DashboardUserComponent,
        PagesComponent,
        UserProfileComponent,
        BusquedaComponent
    ],
    exports: [
        DashboardComponent,
        DashboardAdminComponent,
        PagesComponent,
        ProfileComponent,
        UsersComponent,
        DashboardUserComponent,
        PagesComponent,
        UserProfileComponent,
        BusquedaComponent
    ], imports: [CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        PipesModule,
        ConfModule,
        ComponentsModule,
        NgxPaginationModule,
        ProjectModule,
        ClienteModule,
        PaymentsModule], providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class PagesModule { }
