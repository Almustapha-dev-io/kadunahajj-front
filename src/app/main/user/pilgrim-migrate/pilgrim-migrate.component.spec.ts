import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimMigrateComponent } from './pilgrim-migrate.component';

describe('PilgrimMigrateComponent', () => {
  let component: PilgrimMigrateComponent;
  let fixture: ComponentFixture<PilgrimMigrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimMigrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimMigrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
