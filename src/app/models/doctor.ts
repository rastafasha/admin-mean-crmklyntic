import { environment } from "src/environments/environment";
import { Pais } from "./pais.model";
import { User } from "./user";
import { Speciality } from "./speciality";

const base_url = environment.mediaUrlRemoto;
export class Doctor {
    _id: string;
    nombre: string;
    apellido: string;
    ciudad: string;
    phone: string;
    speciality: Speciality;
    email: string;
    dondeSeEntero: string;
    rrss: string;
    address: string;
    terminos: string;
    
    //crm
    name: string;
    ubicacion: string;
    hasVisited: string;
    tipoClinica: string;

    pais: Pais;
    notificado: boolean;
    status: boolean;
    hasLaboratory: boolean;
    propuesta: string;
    negociacion: string;
    dateVisita: Date;
    dateAprobado: Date;
    partners: User;
    statusapp: 'TEST'| 'SUSCRITO'|'PENDIENTE';
    estado_seguimiento: 'PENDIENTE'| 'INTERESADO_ESPERA_DATOS'|'CORREO_ENVIADO'| 'RECHAZADO';
    email_contacto: string;
    canal_origen: string;
    correo_enviado: string;


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


export class ProjectType {
    _id: string;
    name: string;
}