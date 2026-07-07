import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    EscapeHtmlPipe,
    SafePipe
  ],
  exports: [
    ImagenPipe,
    EscapeHtmlPipe,
    SafePipe
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
