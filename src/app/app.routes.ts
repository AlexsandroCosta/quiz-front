import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { QuizComponent } from './pages/quiz/quiz.component'

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "perfil",
        component: PerfilComponent,
    },
    {
        path: "quiz",
        component: QuizComponent,
    }
    
];
