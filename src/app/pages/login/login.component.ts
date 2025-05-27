import { Component } from '@angular/core';
import { DefaulLoginComponent } from '../../components/default-login/default-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    DefaulLoginComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    AuthService,
    UserService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastrService
  ){
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }

  submit(){
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.auth_token);
        
        this.userService.getUserInfo().subscribe({
          next: (userInfo) => {
            this.userService.setUser(userInfo);
            this.toastService.success("Login feito com sucesso!");
            this.router.navigate(['']);
          },
          error: () => {
            this.toastService.error("Erro ao carregar dados do usuário.");
          }
        })
      },
      error: () => this.toastService.error("Erro ao tentar fazer login."),
    })
  }

  navigate(){
    this.router.navigate(["signup"])
  }
}
