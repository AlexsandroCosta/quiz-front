import { Component } from '@angular/core';
import { DefaultHomeComponent } from '../../components/default-home/default-home.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-perfil',
  imports: [
    DefaultHomeComponent,
    PrimaryInputComponent,
    ReactiveFormsModule
  ],
  providers: [
    UserService
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.sass'
})
export class PerfilComponent {
  formPerfil = new FormGroup({
    nome: new FormControl(''),
    email: new FormControl(''),
    nova_senha: new FormControl(''),
    conf_senha: new FormControl('')
  });

  constructor(
    private userService: UserService,
  ){}

  user: any;

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }
}
