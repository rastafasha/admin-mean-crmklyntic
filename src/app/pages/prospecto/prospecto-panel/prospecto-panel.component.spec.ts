import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectoPanelComponent } from './prospecto-panel.component';

describe('ProspectoPanelComponent', () => {
  let component: ProspectoPanelComponent;
  let fixture: ComponentFixture<ProspectoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectoPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
