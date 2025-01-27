import { NgFor, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.services';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink,NgFor,NgStyle],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  // role: string|null= this.authService.roles$().toString();
  role: string = 'admin';
  sidebarItems: SidebarItem[] = []; 
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.loadSidebarItems();
  }

  loadSidebarItems() {
    if (this.role === 'admin') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        { label: 'Profile', link: '/user', backgroundColor: '#DDEEBB' },
        { label: 'Notices', link: '/home/notice', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        // { label: 'Services', link: '/services', backgroundColor: '#DDEEBB' },
        { label: 'Visitor', link: '/home/visitor', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
      ];
    } else if (this.role === 'resident') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        { label: 'Profile', link: '/user', backgroundColor: '#DDEEBB' },
        { label: 'Notices', link: '/home/notice', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        { label: 'Visitor', link: '/home/visitor', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
      ];
    } else if (this.role === 'guard') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        { label: 'Profile', link: '/user', backgroundColor: '#DDEEBB' },
        { label: 'Notices', link: '/notice', backgroundColor: 'rgba(221, 238, 187, 0.666667)' },
        { label: 'Visitor', link: '/visitor', backgroundColor: '#DDEEBB' }
      ];
    }
  }

  // isNavbarVisible: boolean = false; 
  // toggleNavbar() {
  //   this.isNavbarVisible = !this.isNavbarVisible; // Toggle visibility

  // }
}


interface SidebarItem {
  label: string;
  link: string;
  backgroundColor: string;
}