import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatAllocationsComponent } from './add-seat-allocations.component';

describe('AddSeatAllocationsComponent', () => {
  let component: AddSeatAllocationsComponent;
  let fixture: ComponentFixture<AddSeatAllocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeatAllocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSeatAllocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
