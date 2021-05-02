import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHajjYearComponent } from './view-hajj-year.component';

describe('ViewHajjYearComponent', () => {
  let component: ViewHajjYearComponent;
  let fixture: ComponentFixture<ViewHajjYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHajjYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHajjYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
