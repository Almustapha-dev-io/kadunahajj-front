import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHajjAllocationComponent } from './add-hajj-allocation.component';

describe('AddHajjAllocationComponent', () => {
  let component: AddHajjAllocationComponent;
  let fixture: ComponentFixture<AddHajjAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHajjAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHajjAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
