import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecttypeeditComponent } from './projecttypeedit.component';

describe('ProjecttypeeditComponent', () => {
  let component: ProjecttypeeditComponent;
  let fixture: ComponentFixture<ProjecttypeeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjecttypeeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjecttypeeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
