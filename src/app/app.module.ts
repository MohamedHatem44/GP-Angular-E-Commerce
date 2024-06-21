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
import { DeleteConfirmationModalComponent } from './components/modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { LoaderSpinnerComponent } from './components/shared/loader-spinner/loader-spinner.component';
import { LoaderSkeletonV1Component } from './components/shared/loader-skeleton-v1/loader-skeleton-v1.component';
import { LoaderSkeletonV2Component } from './components/shared/loader-skeleton-v2/loader-skeleton-v2.component';
import { ImgModalComponent } from './components/modals/img-modal/img-modal.component';
import { AdminBrandFormComponent } from './components/admin/admin-brand-form/admin-brand-form.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SaveConfirmationModalComponent } from './components/modals/save-confirmation-modal/save-confirmation-modal.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoryFormComponent } from './components/admin/admin-category-form/admin-category-form.component';
import { LoaderSkeletonV3Component } from './components/shared/loader-skeleton-v3/loader-skeleton-v3.component';
import { AdminUserDetailsModalComponent } from './components/admin/admin-user-details-modal/admin-user-details-modal.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductDetailsModalComponent } from './components/admin/admin-product-details-modal/admin-product-details-modal.component';
import { AdminMessageDetailsModalComponent } from './components/admin/admin-message-details-modal/admin-message-details-modal.component';
import { AdminBrandDetailsModalComponent } from './components/admin/admin-brand-details-modal/admin-brand-details-modal.component';
import { AdminCategoryDetailsModalComponent } from './components/admin/admin-category-details-modal/admin-category-details-modal.component';
import { AdminProductFormComponent } from './components/admin/admin-product-form/admin-product-form.component';
import { UserProfileEditComponent } from './components/user/user-profile-edit/user-profile-edit.component';
import { AdminColorsComponent } from './components/admin/admin-colors/admin-colors.component';
import { AdminColorFormComponent } from './components/admin/admin-color-form/admin-color-form.component';
import { AdminSizesComponent } from './components/admin/admin-sizes/admin-sizes.component';
import { AdminSizeFormComponent } from './components/admin/admin-size-form/admin-size-form.component';
import { AdminProductDetailsComponent } from './components/admin/admin-product-details/admin-product-details.component';
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
    DeleteConfirmationModalComponent,
    AdminDashboardComponent,
    AdminMainComponent,
    AdminUsersComponent,
    LoaderSpinnerComponent,
    LoaderSkeletonV1Component,
    LoaderSkeletonV2Component,
    ImgModalComponent,
    AdminBrandFormComponent,
    SaveConfirmationModalComponent,
    AdminCategoriesComponent,
    AdminCategoryFormComponent,
    LoaderSkeletonV3Component,
    AdminUserDetailsModalComponent,
    AdminProductsComponent,
    AdminProductDetailsModalComponent,
    AdminMessageDetailsModalComponent,
    AdminBrandDetailsModalComponent,
    AdminCategoryDetailsModalComponent,
    AdminProductFormComponent,
    UserProfileEditComponent,
    AdminColorsComponent,
    AdminColorFormComponent,
    AdminSizesComponent,
    AdminSizeFormComponent,
    AdminProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
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
