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

 // Type definitions for slider elements
//  slides: HTMLElement[] = [];
//  currentIndex: number = 0;

//  // Angular lifecycle hook that runs after the view has been initialized
//  ngAfterViewInit(): void {
//    this.slides = Array.from(document.querySelectorAll('.slide'));
//    this.showSlide(this.currentIndex); // Show the first slide initially
//  }

//  // Function to show the current slide
//  showSlide(index: number): void {
//    // Hide all slides
//    this.slides.forEach((slide: HTMLElement) => {
//      slide.classList.remove('active');
//    });

//    // Show the current slide
//    this.slides[index].classList.add('active');
//  }

//  // Function to handle the "Next" button click
//  onNextClick(): void {
//    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
//    this.showSlide(this.currentIndex);
//  }

//  // Function to handle the "Previous" button click
//  onPrevClick(): void {
//    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
//    this.showSlide(this.currentIndex);
//  }
  
}