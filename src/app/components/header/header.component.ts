import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.services';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router : Router, private authService: AuthService){

  }
  logout(): void {
    alert('You have logged out!');
    this.router.navigate(['/home']);

    // Implement your logout logic here, e.g., clear session, redirect to login, etc.
  }
  isLoggedIn(): boolean{
    return this.authService.loggedIn$();
  }
}
