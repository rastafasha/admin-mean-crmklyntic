
export class Recurso {
  constructor(

    public titulo: string,
    public descripcion: string,
    public urlMedia: string,
    public activo: Boolean,
    public fechaCreacion: Date,
    public tipo?: 'video' | 'banner',
    public categoria?: 'general' | 'odontologia' | 'asistentes'|'whatsapp',
    public _id?: string

){}
}
