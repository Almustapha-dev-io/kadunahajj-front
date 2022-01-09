import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerAllocationExportComponent } from './reviewer-allocation-export.component';

describe('ReviewerAllocationExportComponent', () => {
  let component: ReviewerAllocationExportComponent;
  let fixture: ComponentFixture<ReviewerAllocationExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerAllocationExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerAllocationExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
