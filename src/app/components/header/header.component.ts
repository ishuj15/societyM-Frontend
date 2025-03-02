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
    localStorage.removeItem('authToken');
    this.authService.loggedIn$.set(false);
    this.authService.user$.set(null);       
    this.authService.role$.set(undefined);
    alert('You have logged out!');
    this.router.navigate(['/landing']);

    
  }
  isLoggedIn(): boolean{
    return this.authService.loggedIn$();
  }
}
