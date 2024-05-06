import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../guard/auth/auth.guard';
import { IpGuard } from '../guard/ip/ip.guard';



const routes: Routes = [

  {
    path: '',
    component: HomePage,
    // canActivateChild: [IpGuard],

    // children: [
    //   {
    //     path: '',
    //     canActivateChild: [IpGuard],
        children: [
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full'
          },
          {
            path: 'ipConfig',
            loadChildren: () => import('./pages/ip-config/ip-config.module').then(m => m.IpConfigPageModule),
          },
          {
            path: 'products',
            loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule),
            canActivate:[IpGuard]
          },
          {
            path: 'product-details/:id',
            loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsPageModule)
          },
          {
            path: 'product-details/:id/:detailId',
            loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsPageModule)
          },
          {
            path: 'cart',
            loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
            canActivate: [AuthGuard, IpGuard]
          },
          {
            path: 'wishlist',
            loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistPageModule),
            canActivate: [AuthGuard, IpGuard]

          },
          {
            path: 'checkout',
            loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: 'profile',
            loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
            canActivate: [AuthGuard]
          },
          {
            path: 'status',
            loadChildren: () => import('./pages/status/status.module').then(m => m.StatusPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: 'status-details/:id/:detailId',
            loadChildren: () => import('./pages/status-details/status-details.module').then(m => m.StatusDetailsPageModule),
            canActivate: [AuthGuard]
          },
        ]
    //   }
    // ]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'reset-password/:token/:email',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },







  // {
  //   path: 'products/:id',
  //   component:ProductsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
