import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/admin.guard';
import { ChildRoutesModule } from './child-routes.module';
import {DashboardComponent} from './dashboard/dashboard.component';



const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate:[AuthGuard],
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule)
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


