import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  //  toggleNavbar() {
  //   const navbar = document.getElementById('navbar');
  //   if (navbar) {
  //       if (navbar.style.display === 'block') {
  //           navbar.style.display = 'none';
  //       } else {
  //           navbar.style.display = 'block';
  //       }
  //   }
// }
}
