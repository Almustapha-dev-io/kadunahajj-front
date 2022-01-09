import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjAllocationListComponent } from './hajj-allocation-list.component';

describe('HajjAllocationListComponent', () => {
  let component: HajjAllocationListComponent;
  let fixture: ComponentFixture<HajjAllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HajjAllocationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
