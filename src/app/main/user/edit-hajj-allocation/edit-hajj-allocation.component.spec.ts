import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHajjAllocationComponent } from './edit-hajj-allocation.component';

describe('EditHajjAllocationComponent', () => {
  let component: EditHajjAllocationComponent;
  let fixture: ComponentFixture<EditHajjAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHajjAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHajjAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
