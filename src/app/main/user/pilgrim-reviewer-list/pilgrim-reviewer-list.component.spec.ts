import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimReviewerListComponent } from './pilgrim-reviewer-list.component';

describe('PilgrimReviewerListComponent', () => {
  let component: PilgrimReviewerListComponent;
  let fixture: ComponentFixture<PilgrimReviewerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimReviewerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimReviewerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
