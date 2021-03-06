import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatorComponent } from './initiator.component';

describe('InitiatorComponent', () => {
  let component: InitiatorComponent;
  let fixture: ComponentFixture<InitiatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
