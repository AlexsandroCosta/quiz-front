import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-home',
  imports: [],
  templateUrl: './default-home.component.html',
  styleUrl: './default-home.component.sass'
})
export class DefaultHomeComponent {
  constructor(private router: Router){}

  inicio(){
    this.router.navigate([''])
  }

  perfil(){
    this.router.navigate(['perfil'])
  }

  logout() {
    // Aqui você limpa o token/sessão do usuário
    //localStorage.removeItem('token'); // ou o que você estiver usando
    this.router.navigate(['login']);
  }
}
