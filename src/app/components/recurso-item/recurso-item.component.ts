import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recurso } from 'src/app/models/recurso';

@Component({
  selector: 'app-recurso-item',
   standalone: false,
  templateUrl: './recurso-item.component.html',
  styleUrl: './recurso-item.component.css'
})
export class RecursoItemComponent {

   @Input() project: Recurso;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Recurso>();
  @Output() onEditProject = new EventEmitter<Recurso>();
  @Output() selectedProject: Recurso;

 
  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.project._id);
  }

  editProject() {
    this.onEdit.emit(this.project._id);
  }

  deleteProject() {
    this.onDelete.emit(this.project);

  }

  openEditModal(project: Recurso): void {
    this.onEditProject.emit(project);
  }

  openPaymentsModal(project: Recurso): void {
    this.selectedProject = project;
    // console.log(project);
  }

}
