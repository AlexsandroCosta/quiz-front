import { Component } from '@angular/core';
import { DefaulLoginComponent } from '../../components/default-login/default-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface signupForm {
  email: FormControl,
  username: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  imports: [
    DefaulLoginComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    AuthService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent {
  signupForm!: FormGroup<signupForm>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ){
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }

  submit(){
    this.authService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password).subscribe({
      next: () => {
        this.toastService.success("Cadastro feito com sucesso!");
        this.router.navigate(["login"]);
      },
      error: (err) => {
        // Extrai as mensagens de erro do backend
        let messages: string[] = [];

        if (err?.error) {
          for (const key in err.error) {
            if (Array.isArray(err.error[key])) {
              messages = messages.concat(err.error[key]);
            }
          }
        }

        // Se não tiver mensagens, exibe um erro genérico
        if (messages.length === 0) {
          messages.push("Erro ao tentar fazer cadastro");
        }

        // Mostra todas as mensagens concatenadas no toast
        this.toastService.error(messages.join('\n'));
      },
    })
  }

  navigate(){
    this.router.navigate(["login"])
  }
}
