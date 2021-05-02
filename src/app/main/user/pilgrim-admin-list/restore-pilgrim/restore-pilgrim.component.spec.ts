import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePilgrimComponent } from './restore-pilgrim.component';

describe('RestorePilgrimComponent', () => {
  let component: RestorePilgrimComponent;
  let fixture: ComponentFixture<RestorePilgrimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestorePilgrimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestorePilgrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
