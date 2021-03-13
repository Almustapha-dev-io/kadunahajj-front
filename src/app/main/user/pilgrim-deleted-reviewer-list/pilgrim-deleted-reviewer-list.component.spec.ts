import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimDeletedReviewerListComponent } from './pilgrim-deleted-reviewer-list.component';

describe('PilgrimDeletedReviewerListComponent', () => {
  let component: PilgrimDeletedReviewerListComponent;
  let fixture: ComponentFixture<PilgrimDeletedReviewerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimDeletedReviewerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimDeletedReviewerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
