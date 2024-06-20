import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { UserCartComponent } from './components/user/user-cart/user-cart.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserWishlistComponent } from './components/user/user-wishlist/user-wishlist.component';
import { MainShopComponent } from './components/shop/main-shop/main-shop.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BrandsComponent } from './components/shop/brands/brands.component';
import { CategoriesComponent } from './components/shop/categories/categories.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { ProductDetailsComponent } from './components/shop/product-details/product-details.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';
import { AdminMessagesComponent } from './components/admin/admin-messages/admin-messages.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminBrandsComponent } from './components/admin/admin-brands/admin-brands.component';
import { AdminBrandFormComponent } from './components/admin/admin-brand-form/admin-brand-form.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoryFormComponent } from './components/admin/admin-category-form/admin-category-form.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductFormComponent } from './components/admin/admin-product-form/admin-product-form.component';
import { UserProfileEditComponent } from './components/user/user-profile-edit/user-profile-edit.component';
import { AdminColorsComponent } from './components/admin/admin-colors/admin-colors.component';
import { AdminColorFormComponent } from './components/admin/admin-color-form/admin-color-form.component';
/*-----------------------------------------------------------------------------------------------------------------*/
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainHomeComponent },
  {
    path: 'admindashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: AdminMainComponent, pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
      { path: 'addproduct', component: AdminProductFormComponent },
      { path: 'editproduct/:id', component: AdminProductFormComponent },
      { path: 'colors', component: AdminColorsComponent },
      { path: 'addcolor', component: AdminColorFormComponent },
      { path: 'editcolor/:id', component: AdminColorFormComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'addcategory', component: AdminCategoryFormComponent },
      { path: 'editcategory/:id', component: AdminCategoryFormComponent },
      { path: 'brands', component: AdminBrandsComponent },
      { path: 'addbrand', component: AdminBrandFormComponent },
      { path: 'editbrand/:id', component: AdminBrandFormComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'messages', component: AdminMessagesComponent },
    ],
  },
  { path: 'brands', component: BrandsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: MainShopComponent },
  { path: 'productDetails/:id', component: ProductDetailsComponent },
  { path: 'cart', component: UserCartComponent },
  { path: 'wishlist', component: UserWishlistComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'editprofile', component: UserProfileEditComponent },
  { path: 'orders', component: UserOrdersComponent },
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegisterComponent },
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
