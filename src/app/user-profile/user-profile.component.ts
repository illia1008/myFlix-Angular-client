import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  /**
   * Object containing user details.
   */
  user: any = {};

  /**
   * Array of the user's favorite movies.
   */
  favoriteMovies: any[] = [];

  /**
   * Array of all available movies.
   */
  movies: any[] = [];

  /**
   * Constructor to initialize services.
   * @param fetchApiData - Service to interact with the API.
   * @param snackBar - Service to display snack bar notifications.
   * @param router - Service for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook that initializes the component.
   * Fetches user data, favorite movies, and all movies.
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.getfavoriteMovies();
    this.getMovies();
  }

  /**
   * Logs the user out by clearing data from localStorage and navigating to the welcome page.
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.snackBar.open('You have been logged out successfully.', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });

    this.router.navigate(['/welcome']);
  }

  /**
   * Fetches all available movies from the API and logs them to the console.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies:', this.movies);
    });
  }

  /**
   * Updates the user profile using the API and updates localStorage.
   * Refreshes the user's favorite movies after the update.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.user).subscribe(
      (res: any) => {
        this.user = {
          ...res,
          id: res._id,
          password: this.user.password,
          token: this.user.token,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.getfavoriteMovies();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Fetches and filters the user's favorite movies from the list of all movies.
   */
  getfavoriteMovies(): void {
    console.log(this.user.FavoriteMovies);
    this.fetchApiData.getAllMovies().subscribe(
      (res: any) => {
        console.log(res);
        this.favoriteMovies = res.filter((movie: any) => {
          return this.user.FavoriteMovies.includes(movie._id);
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Removes a movie from the user's favorites list.
   * @param movie - The movie to be removed from favorites.
   */
  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.user.Username, movie._id).subscribe(
      (res: any) => {
        console.log('Removed from favorites:', res);

        this.user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem('user', JSON.stringify(this.user));

        this.favoriteMovies = this.favoriteMovies.filter(
          (favMovie) => favMovie._id !== movie._id
        );

        this.snackBar.open(
          `${movie.Title} has been removed from your favorites.`,
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
      },
      (err: any) => {
        console.error('Error removing from favorites:', err);

        this.snackBar.open(
          'Failed to remove the movie from favorites.',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
      }
    );
  }

  /**
   * Resets the user object with the data stored in localStorage.
   */
  resetUser(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  /**
   * Fetches the current user data from localStorage or initializes an empty object if not found.
   */
  getUserInfo(): void {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : {};
    console.log(this.user);
  }
}
