import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-default-home',
  imports: [],
  templateUrl: './default-home.component.html',
  styleUrl: './default-home.component.sass'
})
export class DefaultHomeComponent {
  constructor(private router: Router, public authService: AuthService){}

  inicio(){
    this.router.navigate([''])
  }

  perfil(){
    this.router.navigate(['perfil'])
  }

  logout() {
    this.authService.logout();
  }
}
