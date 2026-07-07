import { environment } from "src/environments/environment";
import { Pais } from "./pais.model";
import { User } from "./user";
import { Speciality } from "./speciality";
const base_url = environment.mediaUrlRemoto;
export class Cliente {
    _id: string;
    name: string;
    url: string;
    rrss: string;
    ubicacion: string;
    category: Speciality;
    pais: Pais;
    dateTest: string;
    dateInicio: string;
    status: boolean;
    partners: User;
    img: string;
     get imagenUrl(){

      if(!this.img){
        return `assets/img/no-image.jpg`;
      } else if(this.img.includes('https')){
        return this.img;
      } else if(this.img){
        return `${base_url}/pagos/${this.img}`;
      }else {
        return `${base_url}/pagos/no-image.jpg`;
      }

    }

}
