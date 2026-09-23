import { environment } from "src/environments/environment";
import { Pais } from "./pais.model";
import { User } from "./user";
import { Speciality } from "./speciality";

const base_url = environment.mediaUrlRemoto;

// 📋 Estructura para los sub-esquemas de descripción y precio del CRM
export interface ItemDetalleMedico {
    descripcion: string;
    precio: string;
}

export class Consultorio {
    _id!: string;
    
    // Identidad del Usuario / Médico
    name!: string; // name user
    nombre?: string;
    apellido?: string;
    slug!: string;
    user_id!: string;

    // Relaciones Estructuradas
    pais?: Pais;
    speciality?: Speciality;
    partners?: User; // Equivalente a la asignación de usuarios/operadores

    // Redes y Fechas
    rrss?: string;
    dateTest?: string;
    dateInicio?: string;
    tipoClinica?: string;

    // Control de Moneda y Pagos
    moneda!: string;
    acepta_usd_internacional!: boolean;
    acepta_moneda_local!: boolean;

    // 🏥 NUEVOS DATOS EXCLUSIVOS DE LA APP DE RESERVAS EXPRESS
    usavacunas!: boolean;
    vacunasList!: ItemDetalleMedico[];
    Servicios_procedimientosList!: ItemDetalleMedico[];
    ConsultasyTarifasList!: ItemDetalleMedico[];
    HorariodeAtencion?: string;

    // Ubicación y Contacto (Sincronizados con los nombres de tu Mongoose)
    ciudad?: string;
    address?: string; // Antes: direccion
    phone?: string;   // Antes: telefono
    img_logo?: string;

    // Estados Administrativos del CRM
    status?: 'Activo' | 'Desactivado';
    statusapp?: 'TEST' | 'SUSCRITO' | 'PENDIENTE' | 'COLABORADOR';
    planSuscripcion!: 'GRATIS' | 'BASICO' | 'PRO';
    fechaVencimiento?: Date;
    idSuscripcionPago?: string;

    // Canal de WhatsApp Bots
    whatsappStatus?: 'CONECTADO' | 'DESCONECTADO' | 'ESPERANDO_QR';
    whatsappQR?: string;
    whatsappConnectedAt?: Date;

    createdAt!: Date;
    updatedAt?: Date;

    // Imagen o Adjunto para pagos
    img?: string;

    get imagenUrl(): string {
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
