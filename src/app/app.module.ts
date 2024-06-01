import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/*-----------------------------------------------------------------------------------------------------------------*/
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { MainSliderComponent } from './components/home/main-slider/main-slider.component';
/*-----------------------------------------------------------------------------------------------------------------*/
@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, FooterComponent, NavBarComponent, AdminPanelComponent, MainHomeComponent, MainSliderComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
/*-----------------------------------------------------------------------------------------------------------------*/
export class AppModule {}
/*-----------------------------------------------------------------------------------------------------------------*/
