import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocalGovComponent } from './edit-local-gov.component';

describe('EditLocalGovComponent', () => {
  let component: EditLocalGovComponent;
  let fixture: ComponentFixture<EditLocalGovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLocalGovComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocalGovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
