import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCondicionesComponent } from './modal-condiciones.component';

describe('ModalCondicionesComponent', () => {
  let component: ModalCondicionesComponent;
  let fixture: ComponentFixture<ModalCondicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCondicionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
