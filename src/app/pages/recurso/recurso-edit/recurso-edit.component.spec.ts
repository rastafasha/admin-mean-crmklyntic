import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursoEditComponent } from './recurso-edit.component';

describe('RecursoEditComponent', () => {
  let component: RecursoEditComponent;
  let fixture: ComponentFixture<RecursoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
