import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user).subscribe((res: any) => {
      this.user = {
        ...res,
        id: res._id,
        password: this.user.password,
        token: this.user.token
      };
      localStorage.setItem("user", JSON.stringify(this.user));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  getfavoriteMovies(): void {
    console.log(this.user.favoriteMovies);
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.favoriteMovies = res.filter((movie: any) => {
        return this.user.favoriteMovies.includes(movie._id);
      });
    }, (err: any) => {
      console.error(err);
    });
  }


  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.user.id, movie.title).subscribe((res: any) => {
      this.user.favoriteMovies = res.favoriteMovies;
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  resetUser(): void {
    this.user = JSON.parse(localStorage.getItem("user") || "");
  }

  logout(): void {
    // Clear user data from localStorage first
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Show a logout confirmation message
    this.snackBar.open('You have been logged out successfully.', 'Close', {
      duration: 3000,
      verticalPosition: 'top' // Position can be 'top' or 'bottom'
    });
  }


  // Fetch current user data from localStorage or API
  getUserInfo(): void {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : {};
    console.log(this.user)
  }

}
