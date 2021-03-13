import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimFormComponent } from './pilgrim-form.component';

describe('PilgrimFormComponent', () => {
  let component: PilgrimFormComponent;
  let fixture: ComponentFixture<PilgrimFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
