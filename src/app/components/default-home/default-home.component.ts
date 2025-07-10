import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-default-home',
  imports: [],
  providers: [
    UserService
  ],
  templateUrl: './default-home.component.html',
  styleUrl: './default-home.component.sass'
})
export class DefaultHomeComponent implements OnInit{
  
  constructor(
    private router: Router, 
    public authService: AuthService,
    private userService: UserService,
  ){}

  user: any;
  fotoUrl: string = '/assets/images/default-profile.jpg';

  ngOnInit(): void {
    this.user = this.userService.getUser();

    this.userService.getUserPhoto().subscribe({
      next: (res) => {
        if (res.foto){
          this.fotoUrl = 'http://127.0.0.1:8000' + res.foto;
        }else{
          this.fotoUrl = '/assets/images/default-profile.jpg';
        }   
      },
      error: () => {
        this.fotoUrl = '/assets/images/default-profile.jpg';
      }
    });
  }
  
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
