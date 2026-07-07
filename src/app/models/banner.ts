import { environment } from "src/environments/environment";
const base_url = environment.mediaUrlRemoto;

export class Banner {
  constructor(

    public titulo: string,
    public description: string,
    public target: string,
    public gotBoton: boolean,
    public botonName: string,
    public url: string,
    public status: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public img?: string,
    public _id?: string

){}


  get imagenUrl(){

    if(!this.img){
      return `${base_url}/banners/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/banners/${this.img}`;
    }else {
      return `${base_url}/no-image.jpg`;
      // return `./assets/img/no-image.jpg`;
    }

  }

}
