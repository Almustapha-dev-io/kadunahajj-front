import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextOfKinDetailsComponent } from './next-of-kin-details.component';

describe('NextOfKinDetailsComponent', () => {
  let component: NextOfKinDetailsComponent;
  let fixture: ComponentFixture<NextOfKinDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextOfKinDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextOfKinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
