import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './features/product/pages/product-details/product-details.component';
import { CompanyDetailsComponent } from './features/company/pages/company-details/company-details.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { MainComponent } from './core/layout/main/main.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';


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
