import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoticeComponent } from './components/notice/notice.component';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing-page/landing.component';
import { VisitorComponent } from './components/visitor/visitor.component';

export const routes: Routes = [
 
    {
        path: '',
        component: LandingComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    {
        path:'home',
        component: HomeComponent,
        // pathMatch:'prefix',
        children:[
            {
                path:'',
                component: DashboardComponent,
            },
           
            {
                path:'dashboard',
                component: DashboardComponent,
            },
            {
                path :'notice',
                component:NoticeComponent
            },
            {
              path:'visitor',
              component:VisitorComponent
            }
        ]
    },
   
    
    
    // {
    //     path: 'alert',
    //     component: 
    // }
    {
        path:'**',
        component: LandingComponent
    },
];
