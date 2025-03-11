import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.services';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-landing',
  standalone:true,
  imports: [RouterLink, HeaderComponent, RouterOutlet],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
    constructor(private router : Router, private authService: AuthService){

    }
    isLoggedIn(): boolean{
      return this.authService.loggedIn$();
    }
  

}
