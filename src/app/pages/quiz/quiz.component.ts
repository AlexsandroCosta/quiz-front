import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHomeComponent } from '../../components/default-home/default-home.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { Quiz } from '../../types/quiz.type';
import { QuizService } from '../../services/quiz.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  imports: [DefaultHomeComponent, CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.sass'
})

export class QuizComponent {
  quiz!: Quiz;
  respostasUsuario: { id_pergunta: number; id_resposta: number }[] = [];

  quizName = 'Nome do Quiz';
  topic = 'Tópico';
  score = 0;
  currentQuestion = 0;
  totalQuestions = 10;
  correctAnswers = 0;
  resultadoFinal: any = null;

  timer!: Subscription;
  timeLeft: number = 10;

  carregandoEnvio = false;

  shuffledRespostas: { id: number; resposta: string; correta: boolean }[] = [];

  get timerDisplay(): string {
    const min = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    const sec = (this.timeLeft % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  iniciarTimer() {
    this.resetTimer();

    const nivel = this.quiz?.nivel;
    switch (nivel) {
      case 'facil':
        this.timeLeft = 10;
        break;
      case 'medio':
        this.timeLeft = 20;
        break;
      case 'dificil':
        this.timeLeft = 30;
        break;
      default:
        this.timeLeft = 10;
    }

    this.timer = interval(1000).subscribe(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.timer.unsubscribe();
        this.avancar();
      }
    });
  }

  resetTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  private loadShuffledRespostas() {
    const respostas = this.currentPergunta?.respostas || [];
    this.shuffledRespostas = this.shuffleArray(respostas);
  }

  ngOnInit() {
    this.quiz = this.quizService.getQuiz();
    
    if (!this.quiz || !this.quiz.conteudos) {
      // Se não tiver nada no serviço nem no localStorage
      this.router.navigate(['/home']);
    }
    this.loadShuffledRespostas();
    this.iniciarTimer();
  }

  constructor(
    private router: Router, 
    private quizService : QuizService,
    private toastService: ToastrService
  ) {}

  currentConteudoIndex = 0;
  currentPerguntaIndex = 0;

  get currentConteudo() {
    return this.quiz?.conteudos?.[this.currentConteudoIndex];
  }

  get currentPergunta() {
    return this.currentConteudo?.perguntas?.[this.currentPerguntaIndex];
  }
 
  responder(resposta: { id: number; resposta: string; correta: boolean }) {
    this.resetTimer();
    const id_pergunta = this.currentPergunta?.quizPergunta_id;

    if (id_pergunta != null) {
      this.respostasUsuario.push({
        id_pergunta,
        id_resposta: resposta.id
      });
    }

    const nivel = this.quiz?.nivel;
    let pontos = 0;

    switch (nivel) {
      case 'facil':
        pontos = 1;
        break;
      case 'medio':
        pontos = 2;
        break;
      case 'dificil':
        pontos = 3;
        break;
      default:
        pontos = 1; 
    }

    if (resposta.correta) {
      this.score += pontos;
      this.correctAnswers++;
    } else {
      this.score -= pontos;
    }

    this.avancar();
  }

  avancar() {
    this.currentPerguntaIndex++;

    if (this.currentPerguntaIndex >= this.currentConteudo.perguntas.length) {
      this.currentConteudoIndex++;
      this.currentPerguntaIndex = 0;
    }

    if (this.currentPergunta) {
      this.currentQuestion++;
      this.loadShuffledRespostas();
      this.iniciarTimer();
    } else {
      const quizId = this.quiz?.id;
      if (quizId) {
        this.carregandoEnvio = true;
        this.quizService.responderQuiz(quizId, this.respostasUsuario).subscribe({
          next: (res) => {
            this.toastService.success('Quiz respondido com sucesso!');
            this.quizService.clearQuiz();
            this.resetTimer();
            this.carregandoEnvio = false;
            this.router.navigate([''])
          },
          error: (err) => {
            this.toastService.error('Erro ao enviar respostas do quiz.');
          }
        });
      } else {
        this.toastService.error('Erro ao enviar respostas do quiz.');
        this.carregandoEnvio = false;
      }

      return;
    }
  }

  abandonar(){
    this.resetTimer();
    this.quizService.clearQuiz();
    this.router.navigate([''])
  }
}
