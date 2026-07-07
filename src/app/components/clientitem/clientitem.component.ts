import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';

@Component({
    selector: 'app-clientitem',
    templateUrl: './clientitem.component.html',
    styleUrls: ['./clientitem.component.css'],
    standalone: false
})
export class ClientitemComponent implements OnInit {

  @Input() cliente: Cliente;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Cliente>();
  @Output() onEditCliente = new EventEmitter<Cliente>();



  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.cliente._id);
  }

  editCliente() {
    this.onEdit.emit(this.cliente._id);
  }

  deleteCliente() {
    this.onDelete.emit(this.cliente);

  }

  openEditModal(cliente: Cliente): void {
    this.onEditCliente.emit(cliente);
  }

  

}
