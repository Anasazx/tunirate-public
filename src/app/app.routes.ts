import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './features/product/pages/product-details/product-details.component';
import { CompanyDetailsComponent } from './features/company/pages/company-details/company-details.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { MainComponent } from './core/layout/main/main.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import {AccountLayoutComponent} from './features/account/layout/account-layout/account-layout.component';
import {MyReviewsComponent} from './features/account/pages/my-reviews/my-reviews.component';
import {SecurityComponent} from './features/account/pages/security/security.component';
import {ProfileCardComponent} from './features/account/pages/profile-card/profile-card.component';
import {MyCommentsComponent} from './features/account/pages/my-comments/my-comments.component';


export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'account',
    component: AccountLayoutComponent,
    children: [
      { path: '', component: ProfileCardComponent },
      { path: 'profile', component: ProfileCardComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'reviews', component: MyReviewsComponent },
      { path: 'comments', component: MyCommentsComponent },
    ],
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'product/:id', component: ProductDetailsComponent },
      { path: 'company/:id', component: CompanyDetailsComponent },
    ],
  },




  // {
  //   path: '**',
  //   redirectTo: '/'
  // },

];
