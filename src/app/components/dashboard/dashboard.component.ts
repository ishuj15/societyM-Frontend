import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { NoticeComponent } from '../notice/notice.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [ ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
}