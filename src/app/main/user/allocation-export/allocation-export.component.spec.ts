import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationExportComponent } from './allocation-export.component';

describe('AllocationExportComponent', () => {
  let component: AllocationExportComponent;
  let fixture: ComponentFixture<AllocationExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
