/*-----------------------------------------------------------------------------------------------------------------*/
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*-----------------------------------------------------------------------------------------------------------------*/
// Auth
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// Admin
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminColorsComponent } from './components/admin/admin-colors/admin-colors.component';
import { AdminColorFormComponent } from './components/admin/admin-color-form/admin-color-form.component';
import { AdminSizesComponent } from './components/admin/admin-sizes/admin-sizes.component';
import { AdminSizeFormComponent } from './components/admin/admin-size-form/admin-size-form.component';
import { AdminBlogsComponent } from './components/admin/admin-blogs/admin-blogs.component';
import { AdminBlogFormComponent } from './components/admin/admin-blog-form/admin-blog-form.component';
import { AdminMessagesComponent } from './components/admin/admin-messages/admin-messages.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminBrandsComponent } from './components/admin/admin-brands/admin-brands.component';
import { AdminBrandFormComponent } from './components/admin/admin-brand-form/admin-brand-form.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoryFormComponent } from './components/admin/admin-category-form/admin-category-form.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductFormComponent } from './components/admin/admin-product-form/admin-product-form.component';
import { AdminProductReviewsComponent } from './components/admin/admin-product-reviews/admin-product-reviews.component';
import { AdminProductDetailsComponent } from './components/admin/admin-product-details/admin-product-details.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
/*-----------------------------------------------------------------------------------------------------------------*/
//Home
import { MainHomeComponent } from './components/home/main-home/main-home.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// Shop
import { MainShopComponent } from './components/shop/main-shop/main-shop.component';
import { BrandsComponent } from './components/shop/brands/brands.component';
import { CategoriesComponent } from './components/shop/categories/categories.component';
import { ProductDetailsComponent } from './components/shop/product-details/product-details.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// User
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserProfileEditComponent } from './components/user/user-profile-edit/user-profile-edit.component';
import { UserPassEditComponent } from './components/user/user-pass-edit/user-pass-edit.component';
import { UserCartComponent } from './components/user/user-cart/user-cart.component';
import { UserWishlistComponent } from './components/user/user-wishlist/user-wishlist.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// Pages
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogComponent } from './components/pages/blog/blog.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// Payment
import { PaymentComponent } from './components/payment/payment.component';
/*-----------------------------------------------------------------------------------------------------------------*/
// Guard
import { authGuard } from './guard/auth.guard';
/*-----------------------------------------------------------------------------------------------------------------*/
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainHomeComponent },
  {
    path: 'admindashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminMainComponent, pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
      { path: 'addproduct', component: AdminProductFormComponent },
      { path: 'productreviews', component: AdminProductReviewsComponent },
      { path: 'editproduct/:id', component: AdminProductFormComponent },
      { path: 'productdetails/:id', component: AdminProductDetailsComponent },
      { path: 'colors', component: AdminColorsComponent },
      { path: 'addcolor', component: AdminColorFormComponent },
      { path: 'editcolor/:id', component: AdminColorFormComponent },
      { path: 'sizes', component: AdminSizesComponent },
      { path: 'addsize', component: AdminSizeFormComponent },
      { path: 'editsize/:id', component: AdminSizeFormComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'addblog', component: AdminBlogFormComponent },
      { path: 'editblog/:id', component: AdminBlogFormComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'addcategory', component: AdminCategoryFormComponent },
      { path: 'editcategory/:id', component: AdminCategoryFormComponent },
      { path: 'brands', component: AdminBrandsComponent },
      { path: 'addbrand', component: AdminBrandFormComponent },
      { path: 'editbrand/:id', component: AdminBrandFormComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'messages', component: AdminMessagesComponent },
    ],
  },
  { path: 'brands', component: BrandsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: MainShopComponent },
  { path: 'shop/shopbycategory/:categoryId', component: MainShopComponent },
  { path: 'shop/shopbybrand/:brandId', component: MainShopComponent },
  { path: 'productDetails/:id', component: ProductDetailsComponent },
  { path: 'cart', component: UserCartComponent },
  { path: 'wishlist', component: UserWishlistComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'editprofile', component: UserProfileEditComponent },
  { path: 'orders', component: UserOrdersComponent, canActivate: [authGuard] },
  { path: 'change-password', component: UserPassEditComponent },
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegisterComponent },
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
/*-----------------------------------------------------------------------------------------------------------------*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
/*-----------------------------------------------------------------------------------------------------------------*/
export class AppRoutingModule {}
/*-----------------------------------------------------------------------------------------------------------------*/
