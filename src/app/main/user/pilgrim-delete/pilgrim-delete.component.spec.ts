import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimDeleteComponent } from './pilgrim-delete.component';

describe('PilgrimDeleteComponent', () => {
  let component: PilgrimDeleteComponent;
  let fixture: ComponentFixture<PilgrimDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
