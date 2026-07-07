import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientitemComponent } from './clientitem.component';

describe('ClientitemComponent', () => {
  let component: ClientitemComponent;
  let fixture: ComponentFixture<ClientitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
