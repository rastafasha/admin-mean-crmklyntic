import { environment } from "src/environments/environment";
import { Pais } from "./pais.model";
import { User } from "./user";
import { Speciality } from "./speciality";

const base_url = environment.mediaUrlRemoto;

export class Doctor {
    _id!: string;
    nombre?: string;
    apellido?: string;
    ciudad?: string;
    phone?: string;
    
    // 💡 FLEXIBILIDAD EN FRÍO: Permitimos que venga la interfaz 'Speciality' o un texto plano (string)
    // para cuando cargamos médicos a pie sin obligar al sistema a crear un ID de especialidad primero.
    speciality: Speciality; 
    
    email?: string; // Puede ser opcional si el médico solo tiene el Instagram cargado
    dondeSeEntero?: string;
    rrss?: string;
    address?: string;
    terminos?: string;
    
    // CRM e Información de Calle
    name?: string;
    ubicacion?: string; // ¡Crucial! Aquí guardas el nombre de la clínica: "HCC", "Clínica Razetti" o "Briceño Rossi"
    hasVisited?: boolean | string; // Se normaliza para soportar booleanos
    tipoClinica?: string;

    pais: Pais ; // Flexible para la carga rápida de la campaña
    notificado?: boolean;
    status?: boolean;
    hasLaboratory?: boolean;
    propuesta?: string;
    negociacion?: string;
    dateVisita?: Date;
    dateAprobado?: Date;
    partners?: User;
    
    // Pipeline de estados sincronizados con el CRM Node.js
    statusapp?: 'TEST' | 'SUSCRITO' | 'PENDIENTE' | 'COLABORADOR';
    estado_seguimiento?: 'PENDIENTE' | 'INTERESADO_ESPERA_DATOS' | 'CORREO_ENVIADO' | 'RECHAZADO' | 'APROBADO';
    
    email_contacto?: string;
    canal_origen?: string;
    
    // 💡 SINCRO BACKEND: Cambiado formalmente a 'boolean' para el control estricto de Mailjet
    correo_enviado?: string; 
    correo_sendit?: boolean; 

    img?: string;

    // Tu método original intacto para la resolución dinámica de imágenes
    get imagenUrl() {
        if (!this.img) {
            return `assets/img/no-image.jpg`;
        } else if (this.img.includes('https')) {
            return this.img;
        } else if (this.img) {
            return `${base_url}/pagos/${this.img}`;
        } else {
            return `${base_url}/pagos/no-image.jpg`;
        }
    }
}

export class ProjectType {
    _id!: string;
    name!: string;
}
