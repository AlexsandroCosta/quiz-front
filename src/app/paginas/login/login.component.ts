import { Component } from '@angular/core';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';

@Component({
  selector: 'app-login',
  imports: [
    LoginPadraoComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {

}
