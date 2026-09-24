import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { SafePipe } from './safe.pipe';
import { CloudinaryVideoPipe } from './cloudinary-video.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    EscapeHtmlPipe,
    SafePipe,
    CloudinaryVideoPipe
  ],
  exports: [
    ImagenPipe,
    EscapeHtmlPipe,
    SafePipe,
    CloudinaryVideoPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
