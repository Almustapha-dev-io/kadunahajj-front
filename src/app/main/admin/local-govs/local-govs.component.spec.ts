import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGovsComponent } from './local-govs.component';

describe('LocalGovsComponent', () => {
  let component: LocalGovsComponent;
  let fixture: ComponentFixture<LocalGovsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalGovsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalGovsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
