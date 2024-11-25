import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Object containing the user's login credentials.
   * @property {string} Username - The username entered by the user.
   * @property {string} Password - The password entered by the user.
   */
  @Input() userData = { Username: "", Password: "" };

  /**
   * Initializes required services for login functionality.
   * @param fetchApiData - Service for API interactions.
   * @param dialogRef - Reference to the dialog containing the login form.
   * @param snackBar - Service for showing notifications.
   * @param router - Angular Router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  /**
   * Angular lifecycle hook that initializes the component.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user by sending credentials to the API.
   * On success:
   * - Closes the login dialog.
   * - Displays a success message with the user's username.
   * - Stores user and token data in localStorage.
   * - Navigates to the movies page.
   * On failure:
   * - Displays a failure notification.
   */
  logInUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (res) => {
        // Close the dialog
        this.dialogRef.close();

        // Show success notification
        this.snackBar.open(`Login success, Welcome ${res.user.username}`, "OK", {
          duration: 2000
        });

        // Store user and token data in localStorage
        let user = {
          ...res.user,
          id: res.user._id,
          password: this.userData.Password,
          token: res.token
        };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.token);

        // Navigate to the movies page
        this.router.navigate(["movies"]);
      },
      (res) => {
        // Show failure notification
        this.snackBar.open("Login fail", "OK", {
          duration: 2000
        });
      }
    );
  }
}
