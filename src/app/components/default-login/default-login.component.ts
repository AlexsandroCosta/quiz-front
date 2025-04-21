import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-default-login',
  imports: [],
  templateUrl: './default-login.component.html',
  styleUrl: './default-login.component.sass'
})
export class DefaulLoginComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
}
