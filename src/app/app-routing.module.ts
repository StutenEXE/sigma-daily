import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SigmaChartComponent } from './sigma-chart/sigma-chart.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToSigmaChart = () => redirectLoggedInTo(['sigma-chart']);
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToSigmaChart)
  },
  {
    path: 'register',
    component: RegisterComponent,
    ...canActivate(redirectToSigmaChart)
  },
  {
    path: 'sigma-chart',
    component: SigmaChartComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
