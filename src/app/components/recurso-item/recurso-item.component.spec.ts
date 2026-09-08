import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursoItemComponent } from './recurso-item.component';

describe('RecursoItemComponent', () => {
  let component: RecursoItemComponent;
  let fixture: ComponentFixture<RecursoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursoItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
