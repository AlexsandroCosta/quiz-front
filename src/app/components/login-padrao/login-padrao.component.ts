import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-padrao',
  imports: [],
  templateUrl: './login-padrao.component.html',
  styleUrl: './login-padrao.component.sass'
})
export class LoginPadraoComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
}
