import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHajjAllocationComponent } from './delete-hajj-allocation.component';

describe('DeleteHajjAllocationComponent', () => {
  let component: DeleteHajjAllocationComponent;
  let fixture: ComponentFixture<DeleteHajjAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHajjAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHajjAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
