import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  logout(): void {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Navigate back to the welcome screen
    this.router.navigate(['/welcome']);

    // Show a logout confirmation message
    this.snackBar.open('You have been logged out successfully.', 'Close', {
      duration: 3000,
      verticalPosition: 'top', // Position can be 'top' or 'bottom'
    });
  }
}
