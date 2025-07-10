import { Component } from '@angular/core';
import { DefaultHomeComponent } from '../../components/default-home/default-home.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

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
    nova_senha: new FormControl(''),
    senha_atual: new FormControl('')
  });

  constructor(
    private userService: UserService,
    private toastService: ToastrService 
  ){}

  user: any;
  fotoUrl: string = '';

  ngOnInit(): void {
    this.user = this.userService.getUser();

    this.userService.getUserPhoto().subscribe({
      next: (res) => {
        console.log
        if(res.foto){
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

  onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.userService.updateUserPhoto(file).subscribe({
      next: () => {
        this.toastService.success('Foto atualizada com sucesso!');
        this.userService.getUserPhoto().subscribe(res => {
          window.location.reload();
        });
      },
      error: () => {
        this.toastService.error('Erro ao atualizar foto de perfil.');
      }
    });
  }

  salvarAlteracoes() {
    const { nome, nova_senha, senha_atual } = this.formPerfil.value;

    if (!nome && !nova_senha) {
      this.toastService.warning('Nenhuma alteração foi feita.');
      return;
    }

    if (!senha_atual) {
      this.toastService.warning('Informe sua senha atual para confirmar.');
      return;
    }

    if (nome) {
      this.userService.updateUsername(senha_atual, nome).subscribe({
        next: () => {
          this.toastService.success('Nome de usuário alterado com sucesso');
          this.userService.getUserInfo().subscribe(user => {
            this.userService.setUser(user);
            window.location.reload();
          });
        },
        error: () => this.toastService.error('Erro ao alterar nome de usuário')
      });
    }

    if (nova_senha) {
      this.userService.updatePassword(senha_atual, nova_senha).subscribe({
        next: () => this.toastService.success('Senha alterada com sucesso'),
        error: () => this.toastService.error('Erro ao alterar senha')
      });
    }
  }

}
