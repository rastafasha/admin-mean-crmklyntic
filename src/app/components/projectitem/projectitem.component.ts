import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';

@Component({
    selector: 'app-projectitem',
    templateUrl: './projectitem.component.html',
    styleUrls: ['./projectitem.component.css'],
    standalone: false
})
export class ProjectitemComponent implements OnInit {

  @Input() project: Doctor;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Doctor>();
  @Output() onEditProject = new EventEmitter<Doctor>();
  @Output() selectedProject: Doctor;

 
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

  openEditModal(project: Doctor): void {
    this.onEditProject.emit(project);
  }

  openPaymentsModal(project: Doctor): void {
    this.selectedProject = project;
    // console.log(project);
  }
}
