import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  // ==========================================
  // 1. SUBIDA DE IMÁGENES (Tu código original intacto)
  // ==========================================
  async actualizarFoto(
    archivo: File,
    tipo: 'profiles' | 'doctors',
    id: string
  ) {
    try {
      const url = `${base_url}/uploads/img/${tipo}/${id}`; // Asegúrate de que coincida con tu ruta /img/ del backend
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // ==========================================
  // 2. 🔥 NUEVO: SUBIDA Y OPTIMIZACIÓN DE VIDEOS KLYNTIC
  // ==========================================
  async actualizarVideo(
    archivo: File,
    tipo: 'recursos' | 'consultorios', // Mapeado estrictamente a las colecciones válidas de Node.js
    id: string
  ): Promise<any> {
    try {
      // Apuntamos al endpoint express /uploads/video/:tipo/:id
      const url = `${base_url}/uploads/video/${tipo}/${id}`;
      
      const formData = new FormData();
      // 🚀 CLAVE: 'video' es el nombre exacto del campo que espera req.files.video en Express
      formData.append('video', archivo); 

      console.log(`⏳ Iniciando transmisión de video hacia Cloudinary... Archivo: ${archivo.name}`);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '' // Mantenemos la seguridad del CRM
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        // Retornamos el objeto completo (con url, cloudinary_id, bytes) para actualizar el JSON en Angular
        return data; 
      } else {
        console.error('❌ Error devuelto por el servidor:', data.msg);
        return false;
      }

    } catch (error) {
      console.error('❌ Fallo crítico en la petición fetch de video:', error);
      return false;
    }
  }
}
