import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimListComponent } from './pilgrim-list.component';

describe('PilgrimListComponent', () => {
  let component: PilgrimListComponent;
  let fixture: ComponentFixture<PilgrimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
