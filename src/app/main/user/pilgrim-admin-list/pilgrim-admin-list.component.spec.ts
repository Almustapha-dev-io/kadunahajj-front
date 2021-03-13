import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimAdminListComponent } from './pilgrim-admin-list.component';

describe('PilgrimAdminListComponent', () => {
  let component: PilgrimAdminListComponent;
  let fixture: ComponentFixture<PilgrimAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimAdminListComponent ]
    })
    .compileComponents();
  });
j
  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
