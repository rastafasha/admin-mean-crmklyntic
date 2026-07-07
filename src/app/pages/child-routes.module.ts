import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionesComponent } from './conf/configuraciones/configuraciones.component';
import { RolesViewComponent } from './conf/roles/roles-view/roles-view.component';

//pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { CategoryEditComponent } from './conf/category/category-edit/category-edit.component';
import { CategoryIndexComponent } from './conf/category/category-index/category-index.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';
import { ClientesListComponent } from './cliente/clientes-list/clientes-list.component';
import { ClienteEditComponent } from './cliente/cliente-edit/cliente-edit.component';
import { PaymentsComponent } from './payment/payments.component';
import { PaymentDetailsComponent } from './payment/payment-details/payment-details.component';
import { ReportarPagoComponent } from './payment/reportar-pago/reportar-pago.component';
import { AuthGuard } from '../guards/auth.guard';
// import { CondicionesComponent } from './condiciones/condiciones.component';




const childRoutes: Routes = [

    // 1. Redirección inicial: Si entran a '', los manda a /dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 2. Ruta real: Aquí es donde verdaderamente se protege y se carga el componente
  { path: '', component: DashboardComponent,  data: { title: 'Dashboard' } },

  // 3. Comodín: Cualquier ruta inválida también va al Dashboard (debe ir al final)
  { path: '**', redirectTo: 'dashboard' },
    //auth

    //configuraciones
    { path: 'configuraciones',  component: ConfiguracionesComponent, data:{title:'Configuraciones'} },
    { path: 'buscar', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'buscar/:termino', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'rolesconf', component: RolesViewComponent, data:{title:'Planes'} },



    { path: 'categories', component: CategoryIndexComponent, data:{title:'Categoria'} },
    { path: 'category/:id', component: CategoryIndexComponent, data:{title:'Categoria'} },
    { path: 'categoria/crear', component: CategoryEditComponent, data:{title:'Crear Categoria'} },
    { path: 'category/edit/:id', component: CategoryEditComponent, data:{title:'Editar Categoria'} },
    
    { path: 'projects', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'projects/:id', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'project/crear', component: ProjectEditComponent, data:{title:'Crear Proyecto'} },
    { path: 'project/edit/:id', component: ProjectEditComponent, data:{title:'Editar Proyecto'} },
    
    { path: 'clientes', component: ClientesListComponent, data:{title:'Cliente'} },
    { path: 'clientes/:id', component: ClientesListComponent, data:{title:'Cliente'} },
    { path: 'cliente/crear', component: ClienteEditComponent, data:{title:'Crear Cliente'} },
    { path: 'cliente/edit/:id', component: ClienteEditComponent, data:{title:'Editar Cliente'} },
    
    { path: 'payments', component: PaymentsComponent, data:{title:'Pago'} },
    { path: 'payments/:id', component: PaymentDetailsComponent, data:{title:'Pago'} },
    { path: 'payment/crear', component: ReportarPagoComponent, data:{title:'Crear Pago'} },
    { path: 'payment/edit/:id', component: ReportarPagoComponent, data:{title:'Editar Pago'} },
    { path: 'payment-detail/:id', component: PaymentDetailsComponent, data:{title:'Revisar Pago'} },

  
    //user
    { path: 'users', component: UsersComponent, data:{title:'Usuarios'} },
    { path: 'user/:id', component: UserProfileComponent, data:{title:'Detalle Usuario'} },
    { path: 'user/edit/:id', component: UserProfileComponent, data:{title:'Editar Usuario'} },
    // { path: 'condiciones/:id', component: CondicionesComponent, data:{title:'Editar Usuario'} },
    // { path: 'user/edit/:id', component: UserDetailsComponent, data:{title:'Editar Usuario'} },
    { path: 'profile/:id',  component: ProfileComponent, data:{title:'Perfil'} },

    { path: 'search/:searchItem', component: UsersComponent, data:{title:'Buscar'} },
    
   

    





]

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoute),
    RouterModule.forChild(childRoutes),
  ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }
