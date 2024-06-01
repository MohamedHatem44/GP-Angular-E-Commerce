import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { UserCartComponent } from './components/user/user-cart/user-cart.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserWishlistComponent } from './components/user/user-wishlist/user-wishlist.component';
import { MainShopComponent } from './components/shop/main-shop/main-shop.component';
/*-----------------------------------------------------------------------------------------------------------------*/
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainHomeComponent },
  { path: 'adminPanel', component: AdminPanelComponent },
  { path: 'shop', component: MainShopComponent },
  { path: 'cart', component: UserCartComponent },
  { path: 'wishlist', component: UserWishlistComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegisterComponent },
];
/*-----------------------------------------------------------------------------------------------------------------*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
/*-----------------------------------------------------------------------------------------------------------------*/
export class AppRoutingModule {}
/*-----------------------------------------------------------------------------------------------------------------*/
