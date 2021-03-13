import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnrollmentZoneComponent } from './edit-enrollment-zone.component';

describe('EditEnrollmentZoneComponent', () => {
  let component: EditEnrollmentZoneComponent;
  let fixture: ComponentFixture<EditEnrollmentZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEnrollmentZoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnrollmentZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
