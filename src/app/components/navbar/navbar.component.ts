import { NgFor, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.services';
import { Roles } from '../signup/signup.component';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink,NgFor,NgStyle],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  // role: string|null= this.authService.roles$().toString();
  role: Roles | null = null;
  sidebarItems: SidebarItem[] = []; 
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.role=this.authService.role$()!;
    this.loadSidebarItems();
    // console.log(this.role)
  }

  loadSidebarItems() {
    if (this.role?.toString() === 'admin') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: '#DAD2FF' },
        { label: 'Manage Users', link: '/home/account', backgroundColor: '#B2A5FF' },
        { label: 'Notices', link: '/home/notice', backgroundColor: '#DAD2FF' },
        { label: 'Services', link: '/home/service', backgroundColor: '#B2A5FF' },
        { label: 'Visitor', link: '/home/visitor', backgroundColor: '#DAD2FF' },      ];
    } else if (this.role?.toString() === 'resident') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: '#DAD2FF' },
        { label: 'Account', link: '/home/account', backgroundColor: '#B2A5FF' },
        { label: 'Notices', link: '/home/notice', backgroundColor: '#DAD2FF' },
        { label: 'Services', link: '/home/service', backgroundColor: '#B2A5FF' },
        { label: 'Visitor', link: '/home/visitor', backgroundColor: '#DAD2FF' },
      ];
    } else if (this.role?.toString() === 'guard') {
      this.sidebarItems = [ 
        { label: 'Dashboard', link: '/home', backgroundColor: '#DAD2FF' },
        { label: 'Account', link: '/home/account', backgroundColor: '#B2A5FF' },
        { label: 'Notices', link: '/home/notice', backgroundColor: '#DAD2FF' },
        { label: 'Visitor', link: '/home/visitor', backgroundColor: '#B2A5FF' },
        
        
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