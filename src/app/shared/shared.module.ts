import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { MenuiconosComponent } from './menuiconos/menuiconos.component';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

//paypal
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { BackButtnComponent } from './backButtn/backButtn.component';
import { PwaNotifInstallerComponent } from './pwa-notif-installer/pwa-notif-installer.component';




@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    PipesModule,
    FormsModule,
    
    // NgxPaginationModule,

],
declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    MenuiconosComponent,
    SearchComponent,
    LoadingComponent,
    BackButtnComponent,
    PwaNotifInstallerComponent
],
exports: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    MenuiconosComponent,
    SearchComponent,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    BackButtnComponent,
    PwaNotifInstallerComponent
]
})
export class SharedModule { }
