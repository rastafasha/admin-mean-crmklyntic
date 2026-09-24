export class Recurso {
  constructor(
    public titulo: string,
    public descripcion: string,
    public urlMedia: string,
    public activo: boolean, // 💡 Corregido a 'boolean' en minúscula (buenas prácticas de TypeScript)
    public fechaCreacion: Date,
    public tipo?: 'video' | 'banner',
    public categoria?: 'general' | 'odontologia' | 'asistentes' | 'whatsapp',
    public _id?: string,
    
    // 🔥 NUEVOS CAMPOS: Espejos del backend para Cloudinary
    public cloudinary_id?: string,
    public bytes?: number
  ) {}

  // 🚀 MÉTODO AUXILIAR UTILS: 
  // Transforma los bytes del backend a megabytes legibles para pintarlo en tus tarjetas
  get pesoEnMB(): string {
    if (!this.bytes) return '0 MB';
    const mb = this.bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }
}
