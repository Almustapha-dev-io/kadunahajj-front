import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateHajjAllocationComponent } from './migrate-hajj-allocation.component';

describe('MigrateHajjAllocationComponent', () => {
  let component: MigrateHajjAllocationComponent;
  let fixture: ComponentFixture<MigrateHajjAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrateHajjAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrateHajjAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
