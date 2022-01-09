import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilgrimExportComponent } from './pilgrim-export.component';

describe('PilgrimExportComponent', () => {
  let component: PilgrimExportComponent;
  let fixture: ComponentFixture<PilgrimExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilgrimExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilgrimExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
