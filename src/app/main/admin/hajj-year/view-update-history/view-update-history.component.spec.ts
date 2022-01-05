import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateHistoryComponent } from './view-update-history.component';

describe('ViewUpdateHistoryComponent', () => {
  let component: ViewUpdateHistoryComponent;
  let fixture: ComponentFixture<ViewUpdateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUpdateHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
