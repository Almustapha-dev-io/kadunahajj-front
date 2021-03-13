import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjYearComponent } from './hajj-year.component';

describe('HajjYearComponent', () => {
  let component: HajjYearComponent;
  let fixture: ComponentFixture<HajjYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HajjYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
