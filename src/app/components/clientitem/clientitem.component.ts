import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Consultorio } from 'src/app/models/consultorio';

@Component({
    selector: 'app-clientitem',
    templateUrl: './clientitem.component.html',
    styleUrls: ['./clientitem.component.css'],
    standalone: false
})
export class ClientitemComponent implements OnInit {

  @Input() consultorio: Consultorio;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Consultorio>();
  @Output() onEditCliente = new EventEmitter<Consultorio>();



  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.consultorio._id);
  }

  editCliente() {
    this.onEdit.emit(this.consultorio._id);
  }

  deleteCliente() {
    this.onDelete.emit(this.consultorio);

  }

  openEditModal(consultorio: Consultorio): void {
    this.onEditCliente.emit(consultorio);
  }

  

}
