import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulLoginComponent } from './default-login.component';

describe('DefaulLoginComponent', () => {
  let component: DefaulLoginComponent;
  let fixture: ComponentFixture<DefaulLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaulLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaulLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
