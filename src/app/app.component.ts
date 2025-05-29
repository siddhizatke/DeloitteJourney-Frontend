import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, NavigationEnd } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { AboutmeComponent } from "./pages/aboutme/aboutme.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, RouterLink, RouterLinkActive, CommonModule]
})
export class AppComponent implements OnInit {
  title = 'MyDeloitteJourney';
  
  constructor(public router: Router) {
    // Monitor route changes to update navigation visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Check login status when route changes
      console.log('Current route:', this.router.url);
      console.log('Logged in:', this.isLoggedIn());
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    // Navigate to login or first page after logout
    this.router.navigate(['/FirstPage']);
  }
  
  ngOnInit() {
    console.log('User is logged in:', this.isLoggedIn());
  }
  
  isFirstPage(): boolean {
    return this.router.url === '/FirstPage';
  }
  
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}