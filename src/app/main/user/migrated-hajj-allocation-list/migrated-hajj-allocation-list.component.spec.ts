import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigratedHajjAllocationListComponent } from './migrated-hajj-allocation-list.component';

describe('MigratedHajjAllocationListComponent', () => {
  let component: MigratedHajjAllocationListComponent;
  let fixture: ComponentFixture<MigratedHajjAllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigratedHajjAllocationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigratedHajjAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
