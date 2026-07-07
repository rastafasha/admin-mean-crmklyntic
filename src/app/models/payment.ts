import { Cliente } from './cliente'; // Asegúrate de la ruta
import { User } from './user'; // Si tienes el modelo de usuario

// Definimos la estructura interna de la repartición
interface DetalleReparticion {
    id: string | User; // Puede ser el ID o el objeto completo si haces populate
    monto: number;
}

export class Payment {
    _id?: string;
    cliente: Cliente;
    amount: number;
    tipo_pago: 'inscripcion' | 'suscripcion'; // Usamos literal types para mayor seguridad
    status: boolean;
    referencia: string;
    bank_destino: string;
    
    // Aquí el cambio clave: reparticion es un objeto, no un string
    reparticion: {
        vendedor: DetalleReparticion;
        admin: DetalleReparticion;
        ceo: DetalleReparticion;
    };

    metodo_pago?: string;
    fecha_verificacion?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {
        this.status = false; // Valor por defecto
    }
}