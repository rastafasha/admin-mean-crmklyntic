import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Speciality } from 'src/app/models/speciality';

@Component({
    selector: 'app-projecttypeedit',
    templateUrl: './projecttypeedit.component.html',
    styleUrls: ['./projecttypeedit.component.css'],
    standalone: false
})
export class ProjecttypeeditComponent implements OnInit {

  @Input() categories: Speciality;
  displaycomponent: string = 'none';
  public categorySeleccionado: Speciality;
  error: string;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  handleSubmit(){}

  

}
