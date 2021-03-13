import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentZonesComponent } from './enrollment-zones.component';

describe('EnrollmentZonesComponent', () => {
  let component: EnrollmentZonesComponent;
  let fixture: ComponentFixture<EnrollmentZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
