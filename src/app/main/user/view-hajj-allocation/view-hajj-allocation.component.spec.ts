import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHajjAllocationComponent } from './view-hajj-allocation.component';

describe('ViewHajjAllocationComponent', () => {
  let component: ViewHajjAllocationComponent;
  let fixture: ComponentFixture<ViewHajjAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHajjAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHajjAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
