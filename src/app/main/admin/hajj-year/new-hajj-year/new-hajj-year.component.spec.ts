import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHajjYearComponent } from './new-hajj-year.component';

describe('NewHajjYearComponent', () => {
  let component: NewHajjYearComponent;
  let fixture: ComponentFixture<NewHajjYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHajjYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHajjYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
