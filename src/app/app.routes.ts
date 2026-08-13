import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './features/product/pages/product-details/product-details.component';
import { CompanyDetailsComponent } from './features/company/pages/company-details/company-details.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { MainComponent } from './core/layout/main/main.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import {AccountLayoutComponent} from './features/account/layout/account-layout/account-layout.component';
import {MyReviewsComponent} from './features/account/pages/my-reviews/my-reviews.component';
import {SecurityComponent} from './features/account/pages/security/security.component';
import {ProfileCardComponent} from './features/account/pages/profile-card/profile-card.component';
import {MyCommentsComponent} from './features/account/pages/my-comments/my-comments.component';
import {MySuggestionsComponent} from './features/account/pages/my-suggestions/my-suggestions.component';
import {VerifyEmailComponent} from './features/auth/pages/verify-email/verify-email.component';
import {guestGuard} from './core/guards/guestGuard/guest.guard';
import {emailVerificationGuard} from './core/guards/emailVerificationGuard/email-verification.guard';
import {authGuard} from './core/guards/authGuard/auth.guard';
import {SearchComponent} from './features/search/pages/search/search.component';
import {CategoriesComponent} from './features/category/pages/categories/categories.component';
import {AllProductsComponent} from './features/product/pages/all-products/all-products.component';
import {RegisterComponent} from './features/auth/pages/register/register.component';
import {NotFoundComponent} from './core/sharedComponents/not-found/not-found.component';
import {AboutComponent} from './features/about/about/about.component';


export const routes: Routes = [
  {
    path: 'account',
    component: AccountLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: ProfileCardComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'reviews', component: MyReviewsComponent },
      { path: 'comments', component: MyCommentsComponent },
      { path: 'suggestions', component: MySuggestionsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'p/:id', component: ProductDetailsComponent },
      { path: 'c/:id', component: CompanyDetailsComponent },
      { path: 'search', component: SearchComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: AllProductsComponent },
      { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
      { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
      { path: 'auth/verify', component: VerifyEmailComponent, canActivate: [emailVerificationGuard] },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'about', component: AboutComponent }

    ]
  },

  {
    path: '**',
    redirectTo: 'not-found'
  }

];
