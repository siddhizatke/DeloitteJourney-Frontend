import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-first-page',
  imports: [RouterModule, CommonModule, MatSnackBarModule],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.css'
})
export class FirstPageComponent {
  isLoggedIn = false;

  constructor(
    private titleService: Title,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Welcome To My Deloitte Journey');
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  navigateTo(route: string): void {
  if (this.isLoggedIn) {
    this.router.navigate([route]);
  } else {
    // Show error message positioned at the top
    this.snackBar.open('You need to login first', 'Close', {
      duration: 5000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
    
    localStorage.setItem('redirectUrl', route);
    this.router.navigate(['/login']);
  }
}

  login(): void {
    // This is just for navigation, actual login happens in login component
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
  }
}