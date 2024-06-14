import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/*-----------------------------------------------------------------------------------------------------------------*/
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
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
import { BlogComponent } from './components/pages/blog/blog.component';
import { MainCardsComponent } from './components/home/main-cards/main-cards.component';
import { ProductsComponent } from './components/shop/products/products.component';
import { ProductDetailsComponent } from './components/shop/product-details/product-details.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';
import { AdminMessagesComponent } from './components/admin/admin-messages/admin-messages.component';
import { AdminBrandsComponent } from './components/admin/admin-brands/admin-brands.component';
import { LoadingSpinnerV1Component } from './components/shared/loading-spinner-v1/loading-spinner-v1.component';
import { DeleteConfirmationModalComponent } from './components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { AdminMessageDetailsModelComponent } from './components/admin/admin-message-details-model/admin-message-details-model.component';
/*-----------------------------------------------------------------------------------------------------------------*/
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    NavBarComponent,
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
    BlogComponent,
    MainCardsComponent,
    ProductsComponent,
    ProductDetailsComponent,
    UserOrdersComponent,
    AdminMessagesComponent,
    AdminBrandsComponent,
    LoadingSpinnerV1Component,
    DeleteConfirmationModalComponent,
    AdminDashboardComponent,
    AdminMainComponent,
    AdminMessageDetailsModelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
/*-----------------------------------------------------------------------------------------------------------------*/
export class AppModule {}
/*-----------------------------------------------------------------------------------------------------------------*/
