import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
/*--------------------------------------------------------------------------------------------------------------------*/
const routes: Routes = [
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegisterComponent },
];
/*--------------------------------------------------------------------------------------------------------------------*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
/*--------------------------------------------------------------------------------------------------------------------*/
export class AppRoutingModule {}
/*--------------------------------------------------------------------------------------------------------------------*/
