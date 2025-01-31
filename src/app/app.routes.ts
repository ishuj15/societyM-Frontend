import {  Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginGuard } from './shared/guard/login.huard';
import { LandingComponent } from './components/landing-page/landing.component';

export const routes: Routes = [
 
    {
        path: '',
        component:LandingComponent
 
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then((mod)=>mod.LoginComponent)
 
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/signup/signup.component').then((mod)=>mod.SignupComponent)
 
      },
    {
        path:'home',
        loadComponent: () => import('./components/home/home.component').then((mod)=>mod. HomeComponent),
        // pathMatch:'prefix',
        children:[
            {
                path:'',
                // component: DashboardComponent,
                loadComponent: () => import('./components/dashboard/dashboard.component').then((mod)=>mod.DashboardComponent),
                canActivate :[ LoginGuard]
            },
           
            {
                path:'dashboard',
                loadComponent: () => import('./components/dashboard/dashboard.component').then((mod)=>mod.DashboardComponent),
                canActivate :[ LoginGuard]
            },
            {
                path :'notice',
                loadComponent: () => import('./components/notice/notice.component').then((mod)=>mod.NoticeComponent),
                canActivate :[ LoginGuard]
            },
            {
              path:'visitor',
              loadComponent: () => import('./components/visitor/visitor.component').then((mod)=>mod.VisitorComponent),
              canActivate :[ LoginGuard]
            },
            {
              path:'account',
              loadComponent: () => import('./components/user/user.component').then((mod)=>mod.UserComponent),
              canActivate :[ LoginGuard]
              
            },

            {
              path:'service',
              loadComponent: () => import('./components/services/services.component').then((mod)=>mod.ServicesComponent),
              canActivate :[ LoginGuard]
              
            }
        ]
    },
   

    {
        path:'**',
        loadComponent: () => import('./components/landing-page/landing.component').then((mod)=>mod.LandingComponent)
    },
];
