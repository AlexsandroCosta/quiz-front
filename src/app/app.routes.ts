import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { QuizComponent } from './pages/quiz/quiz.component'
import { authGuard } from './guard/auth.guard';
import { noAuthGuard } from './guard/no-auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: "",
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: "perfil",
        component: PerfilComponent,
        canActivate: [authGuard]
    },
    {
        path: "quiz",
        component: QuizComponent,
        canActivate: [authGuard]
    }
    
];
