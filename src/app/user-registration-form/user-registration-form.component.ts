import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Input object containing user registration data.
   * @property {string} Username - The user's username.
   * @property {string} Password - The user's password.
   * @property {string} Email - The user's email address.
   * @property {string} Birthday - The user's date of birth.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructor to initialize services.
   * @param fetchApiData - Service to interact with the API.
   * @param dialogRef - Reference to the material dialog for closing it after registration.
   * @param snackBar - Service to display snack bar notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Angular lifecycle hook that initializes the component.
   */
  ngOnInit(): void {}

  /**
   * Registers a new user by sending the form inputs to the backend.
   * Displays a success or failure notification based on the API response.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open('User created successfully', 'OK', {
          duration: 2000
        });
      },
      (result) => {
        this.snackBar.open('User creation failed', 'OK', {
          duration: 2000
        });
      }
    );
  }
}
