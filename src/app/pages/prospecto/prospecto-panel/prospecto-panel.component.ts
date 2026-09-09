import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';
import { Speciality } from 'src/app/models/speciality';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { SpecialityService } from 'src/app/services/speciality.service';
import Swal from 'sweetalert2'; // Opcional: Para alertas estéticas, si no usas puedes cambiar a alert()


@Component({
  selector: 'app-prospecto-panel',
  standalone:false,
  templateUrl: './prospecto-panel.component.html',
  styleUrl: './prospecto-panel.component.css'
})
export class ProspectoPanelComponent implements OnInit{

  public cargando: boolean = true;
  public doctors: Doctor[] = [];
  public doctoresFiltrados: Doctor[] = [];
  public specialities: Speciality[] = [];
  p: number = 1;
  count: number = 6;
  limite: number = 6;
  public desde: number = 0;
public totalRegistros: number = 0;

  // Variables para los filtros seleccionados en la interfaz
  public filtroClinica: string = '';
  public filtroCorreo: string = 'TODOS'; // 'TODOS', 'CON_CORREO', 'SOLO_INSTAGRAM'

  // 🎛️ TUS VARIABLES EXACTAS DE FILTRADO
  public query: string = '';
  public selectedType: string = '';
  public selectedtipoClinica: string = '';
  public selectedEstado: string = '';

  public seleccionarTodosMasteer: boolean = false;

  constructor(
    private categoriaService: SpecialityService,
    private projectService: DoctorService,
        private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarDatosCRM();
    this.getCategories();
  }

  getCategories() {
    this.categoriaService.getSpecialities().subscribe((resp: any) => {
      this.specialities = resp;
    })

  }


  
/**
 * Carga el lote de 6 médicos correspondientes a la página actual
 */
cargarDatosCRM(): void {
  this.cargando = true;
  
  // Pasamos los parámetros de paginación limpios al servicio unificado
  this.projectService.obtenerProspectos(this.desde, this.limite).subscribe({
    next: (resp: any) => {
      this.doctors = resp.doctors || [];
      this.totalRegistros = resp.total || 0;
      this.cargando = false;
      
      // 🚀 EMISIÓN LIMPIA: Le mandamos los 6 médicos directo al hijo. 
      // Al hacerlo aquí, cortamos cualquier loop circular del método search().
      this.projectService.emitFilteredDoctors(this.doctors);
    },
    error: (err) => {
      console.error(err);
      this.cargando = false;
    }
  });
}

/**
 * Función para los botones de Siguiente y Anterior del paginador
 */
cambiarPagina(valor: number): void {
  const nuevoDesde = this.desde + valor;

  // Validaciones de seguridad para no salirnos del rango real de la BD
  if (nuevoDesde < 0) return;
  if (nuevoDesde >= this.totalRegistros) return;

  this.desde = nuevoDesde;
  this.cargarDatosCRM(); // Al cambiar de página, hace una sola petición limpia
}


/**
 * Activa o desactiva todos los checkboxes de la página actual con un solo clic
 */
toggleSeleccionarTodos(): void {
  this.doctoresFiltrados.forEach(doc => {
    // Solo permite marcar a los que tienen correo real y no han sido enviados
    if (doc.email && !doc.correo_enviado) {
      (doc as any).seleccionado = this.seleccionarTodosMasteer;
    }
  });
}
  

  /**
   * Dispara un único correo individual a un médico específico (Prueba manual)
   */
  enviarCorreoUnico(doctor: Doctor): void {
    if (!doctor._id || !doctor.email_contacto) return;

    Swal.fire({
      title: `¿Enviar invitación al Dr(a). ${doctor.name}?`,
      text: `Se enviará el correo a la bandeja ${doctor.email_contacto}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.enviarCorreoIndividual(doctor._id).subscribe({
          next: (resp) => {
            doctor.correo_sendit = true;
            doctor.estado_seguimiento = 'CORREO_ENVIADO';
            Swal.fire('Enviado', resp.msg, 'success');
          },
          error: (err) => {
            Swal.fire('Error', 'Falló el envío individual en el servidor', 'error');
          }
        });
      }
    });
  }

  /**
   * Dispara el lote diario de 200 correos automáticos controlados en segundo plano
   */
  ejecutarMasiveCampaing(): void {
    // Filtramos del array filtrado de la pantalla cuáles tienen el check activo
  const doctoresSeleccionados = this.doctoresFiltrados.filter(d => (d as any).seleccionado);
  
  if (doctoresSeleccionados.length === 0) {
    Swal.fire('Atención', 'Por favor, selecciona al menos un médico con la casilla de verificación para iniciar el envío.', 'info');
    return;
  }

  // Extraemos únicamente los IDs para mandárselos en lote al backend
  const idsParaEnviar = doctoresSeleccionados.map(d => d._id);

  Swal.fire({
    title: `¿Enviar campaña a los ${idsParaEnviar.length} médicos seleccionados?`,
    text: `Se procesará el lote controlado en segundo plano respetando la cuota de Mailjet.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6366f1',
    confirmButtonText: 'Sí, iniciar envío 🚀',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // 💡 REGLA DE ORO: Modificamos tu servicio para pasarle el array de IDs en el body
      this.projectService.enviarCampañaMasivaPorIds(idsParaEnviar).subscribe({
        next: (resp) => {
          Swal.fire('Lote Iniciado', resp.msg, 'success');
          
          // Desmarcamos los checks y recargamos la data para ver los nuevos estados enviados
          this.seleccionarTodosMasteer = false;
          this.cargarDatosCRM();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo procesar el lote seleccionado en el servidor', 'error');
        }
      });
    }
  });
  }


  /**
   * 🔍 TU MÉTODO SEARCH: Filtra en tiempo real cruzando todas las variables
   */
search() {
  // CASO 1: No hay término de búsqueda escrito en el input
  if (!this.query || this.query.trim() === '') {

    // Subcaso A: Seleccionó una categoría (con o sin estado)
    if (this.selectedType) {
      this.cargando = true;
      return this.projectService.getProjectsByCategory(this.selectedType, this.selectedEstado)
        .subscribe((resp: any) => {
          this.doctors = resp;
          this.projectService.emitFilteredDoctors(resp);
          this.cargando = false;
        });
    }
    
    // NUEVO Subcaso B: Seleccionó Tipo de Clínica Y Estado al mismo tiempo
    // (Asegúrate de que tu servicio 'searchByCollection' acepte un 4to parámetro para tipoClinica)
    else if (this.selectedEstado && this.selectedtipoClinica) {
      this.cargando = true;
      return this.busquedasService.searchByCollection('doctors', '', this.selectedEstado, this.selectedtipoClinica)
        .subscribe((resp: any) => {
          this.doctors = resp.resultados || [];
          this.projectService.emitFilteredDoctors(this.doctors);
          this.cargando = false;
        });
    }

    // Subcaso C: SÓLO hay tipo de clínica
    else if (this.selectedtipoClinica) {
      this.cargando = true;
      // OJO: Si el 3er parámetro es el estado, envía null/vacío antes de la clínica
      return this.busquedasService.searchByCollection('doctors', '', null, this.selectedtipoClinica)
        .subscribe((resp: any) => {
          this.doctors = resp.resultados || [];
          console.log(resp);
          this.projectService.emitFilteredDoctors(this.doctors);
          this.cargando = false;
        });
    }

    // Subcaso D: SÓLO hay un estado seleccionado
    else if (this.selectedEstado) {
      this.cargando = true;
      return this.busquedasService.searchByCollection('doctors', '', this.selectedEstado)
        .subscribe((resp: any) => {
          this.doctors = resp.resultados || [];
          this.projectService.emitFilteredDoctors(this.doctors);
          this.cargando = false;
        });
    }
    
    // Subcaso E: Sin filtros seleccionados
    else {
      this.ngOnInit();
      return;
    }
  }

  // CASO 2: Sí hay un término de búsqueda en el input de texto
  else {
    return this.busquedasService.searchGlobal(this.query, this.selectedEstado, this.selectedtipoClinica)
      .subscribe((resp: any) => {
        let filteredProjects = resp.projects || [];

        if (this.selectedType) {
          filteredProjects = filteredProjects.filter(
            (project: any) => project.category?.nombre === this.selectedType
          );
        }

        this.doctors = filteredProjects;
        this.projectService.emitFilteredDoctors(filteredProjects);
      });
  }
}

  /**
   * Botón de refrescar / Mostrar todos
   */
  PageSize(): void {
    this.query = '';
    this.selectedType = '';
    this.selectedtipoClinica = '';
    this.selectedEstado = '';

    // 💡 EL TRUCO: Forzamos temporalmente a que los botones se vuelvan a activar en la vista
  // this.doctoresFiltrados.forEach(doc => {
  //   doc.correo_enviado = false; 
  //   // Esto engaña al [disabled] del HTML para que te deje volver a hacer clic en "Enviar Correo"
  // });
    this.search();
  }

}
