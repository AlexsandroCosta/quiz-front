import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPadraoComponent } from './login-padrao.component';

describe('LoginPadraoComponent', () => {
  let component: LoginPadraoComponent;
  let fixture: ComponentFixture<LoginPadraoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPadraoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
