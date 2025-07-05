import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHomeComponent } from '../../components/default-home/default-home.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { Quiz } from '../../types/quiz.type';
import { QuizService } from '../../services/quiz.service';
import { ToastrService } from 'ngx-toastr';

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
  timerDisplay = '10:00'; // Placeholder for timer
  score = 0;
  currentQuestion = 0;
  totalQuestions = 10;
  correctAnswers = 0;

  ngOnInit() {
    this.quiz = this.quizService.getQuiz();
    
    if (!this.quiz || !this.quiz.conteudos) {
      // Se não tiver nada no serviço nem no localStorage
      this.router.navigate(['/home']);
    }
    
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
    const id_pergunta = this.currentPergunta?.quizPergunta_id;

    if (id_pergunta != null) {
      this.respostasUsuario.push({
        id_pergunta,
        id_resposta: resposta.id
      });
    }

    if (resposta.correta) {
      this.score += 1000;
      this.correctAnswers++;
    }

    this.avancar();
  }

  avancar() {
    this.currentPerguntaIndex++;

    if (this.currentPerguntaIndex >= this.currentConteudo.perguntas.length) {
      this.currentConteudoIndex++;
      this.currentPerguntaIndex = 0;
    }

    if (!this.currentPergunta) {
      const quizId = this.quiz?.id;
      if (quizId) {
        console.log(this.respostasUsuario)
        this.quizService.responderQuiz(quizId, this.respostasUsuario).subscribe({
          next: (res) => {
            this.toastService.success('Quiz respondido com sucesso!');
            this.quizService.clearQuiz();
            this.router.navigate(['']);
          },
          error: (err) => {
            this.toastService.error('Erro ao enviar respostas do quiz.');
          }
        });
      } else {
        this.toastService.error('Erro ao enviar respostas do quiz.');
      }

      return;
    }

    this.currentQuestion++;
  }

  abandonar(){
    this.quizService.clearQuiz();
    this.router.navigate([''])
  }
}
