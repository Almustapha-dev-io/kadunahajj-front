import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPilgrimComponent } from './edit-pilgrim.component';

describe('EditPilgrimComponent', () => {
  let component: EditPilgrimComponent;
  let fixture: ComponentFixture<EditPilgrimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPilgrimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPilgrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
