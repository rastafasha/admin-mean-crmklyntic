import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoresComponent } from './editores.component';

describe('EditoresComponent', () => {
  let component: EditoresComponent;
  let fixture: ComponentFixture<EditoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
