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
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getfavoriteMovies();
    this.getMovies();
  }

  // Fetch all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies:', this.movies);
    });
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
    console.log(this.user.FavoriteMovies);
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      console.log(res)
      this.favoriteMovies = res.filter((movie: any) => {
        return this.user.FavoriteMovies.includes(movie._id);
      });
    }, (err: any) => {
      console.error(err);
    });
  }


  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.user.Username, movie._id).subscribe(
      (res: any) => {
        console.log('Removed from favorites:', res);

        // Update user's favorite movies locally
        this.user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem('user', JSON.stringify(this.user));

        // Filter out the removed movie from the favoriteMovies array
        this.favoriteMovies = this.favoriteMovies.filter(
          (favMovie) => favMovie._id !== movie._id
        );

        // Optional: Show a confirmation message
        this.snackBar.open(`${movie.Title} has been removed from your favorites.`, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (err: any) => {
        console.error('Error removing from favorites:', err);

        // Optional: Show an error message
        this.snackBar.open('Failed to remove the movie from favorites.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
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
