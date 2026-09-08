import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recurso } from 'src/app/models/recurso';

@Component({
  selector: 'app-recurso-item',
   standalone: false,
  templateUrl: './recurso-item.component.html',
  styleUrl: './recurso-item.component.css'
})
export class RecursoItemComponent {

   @Input() recurso: Recurso;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Recurso>();
  @Output() onEditRecurso = new EventEmitter<Recurso>();
  @Output() selectedRecurso: Recurso;

 
  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.recurso._id);
  }

  editProject() {
    this.onEdit.emit(this.recurso._id);
  }

  deleteRecurso() {
    this.onDelete.emit(this.recurso);

  }

  openEditModal(recurso: Recurso): void {
    this.onEditRecurso.emit(recurso);
  }

  openPaymentsModal(recurso: Recurso): void {
    this.selectedRecurso = recurso;
    // console.log(project);
  }

}
