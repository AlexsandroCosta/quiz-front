import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHomeComponent } from '../../components/default-home/default-home.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  imports: [DefaultHomeComponent, CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.sass'
})

export class QuizComponent {
  quizName = 'Nome do Quiz';
  topic = 'Tópico';
  timerDisplay = '10:00'; // Placeholder for timer
  score = 0;
  combo = 0;
  currentQuestion = 0;
  totalQuestions = 10;
  correctAnswers = 0;

  ngOnInit() {
    // You can add logic to start countdown, etc.
  }

  constructor(private router: Router) {}

  home(){
    this.router.navigate([''])
  }
}
