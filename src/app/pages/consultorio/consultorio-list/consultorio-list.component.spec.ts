import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorioListComponent } from './consultorio-list.component';

describe('ConsultorioListComponent', () => {
  let component: ConsultorioListComponent;
  let fixture: ComponentFixture<ConsultorioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
