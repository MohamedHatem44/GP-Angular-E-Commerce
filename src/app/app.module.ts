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
import { MainBannerComponent } from './components/home/main-banner/main-banner.component';
import { AuthFooterComponent } from './components/auth/auth-footer/auth-footer.component';
import { UserCartComponent } from './components/user/user-cart/user-cart.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserWishlistComponent } from './components/user/user-wishlist/user-wishlist.component';
import { MainShopComponent } from './components/shop/main-shop/main-shop.component';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { BrandsComponent } from './components/shop/brands/brands.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { CategoriesComponent } from './components/shop/categories/categories.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
/*-----------------------------------------------------------------------------------------------------------------*/
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    NavBarComponent,
    AdminPanelComponent,
    MainHomeComponent,
    MainSliderComponent,
    MainBannerComponent,
    AuthFooterComponent,
    UserCartComponent,
    UserProfileComponent,
    UserWishlistComponent,
    MainShopComponent,
    AdminSidebarComponent,
    BrandsComponent,
    NotFoundComponent,
    CategoriesComponent,
    AboutComponent,
    ContactComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
/*-----------------------------------------------------------------------------------------------------------------*/
export class AppModule {}
/*-----------------------------------------------------------------------------------------------------------------*/
