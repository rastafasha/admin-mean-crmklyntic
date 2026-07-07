import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Angular plugin.
import { NgxPaginationModule } from 'ngx-pagination';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsuariosRecientesComponent } from './usuarios-recientes/usuarios-recientes.component';
import {PipesModule} from '../pipes/pipes.module';
import { EditoresComponent } from './editores/editores.component';
import { ModalCondicionesComponent } from './modal-condiciones/modal-condiciones.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChart2Component } from './charts/pie-chart2/pie-chart2.component';
import { ProjectitemComponent } from './projectitem/projectitem.component';
import { ProjecttypeeditComponent } from './projecttypeedit/projecttypeedit.component';
import { ConfModule } from '../pages/conf/conf.module';
import { SharedModule } from '../shared/shared.module';
import { ClientitemComponent } from './clientitem/clientitem.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

@NgModule({ declarations: [
        UsuariosRecientesComponent,
        EditoresComponent,
        ModalCondicionesComponent,
        LineChartComponent,
        PieChart2Component,
        ProjectitemComponent,
        ProjecttypeeditComponent,
        ClientitemComponent,
        BarChartComponent,
    ],
    exports: [
        UsuariosRecientesComponent,
        EditoresComponent,
        ModalCondicionesComponent,
        LineChartComponent,
        PieChart2Component,
        ProjectitemComponent,
        ProjecttypeeditComponent,
        ClientitemComponent,
        BarChartComponent
    ], imports: [CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule,
        NgxPaginationModule,
        ConfModule,
        SharedModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ComponentsModule { }
