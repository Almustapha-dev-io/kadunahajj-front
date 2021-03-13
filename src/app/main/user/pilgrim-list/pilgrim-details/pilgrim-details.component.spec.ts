import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimDetailsComponent } from './pilgrim-details.component';

describe('PilgrimDetailsComponent', () => {
  let component: PilgrimDetailsComponent;
  let fixture: ComponentFixture<PilgrimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
