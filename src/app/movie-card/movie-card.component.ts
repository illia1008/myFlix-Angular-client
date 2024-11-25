import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};

  constructor(public fetchApiData: FetchApiDataService) {}

  /**
   * Angular lifecycle hook that initializes the component.
   * Calls methods to fetch movies and load user data.
   */
  ngOnInit(): void {
    this.getMovies();
    this.loadUserData();
  }

  /**
   * Fetches all movies from the API and maps their data.
   * Logs each movie's `ImagePath` to the console.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.map((movie: any) => {
        console.log('ImagePath:', movie.ImagePath);
        return movie;
      });
      console.log('Movies:', this.movies);
    });
  }

  /**
   * Loads user data from localStorage.
   * Logs the user data if found, or logs an error if no user is found.
   */
  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log('Loaded user:', this.user);
    } else {
      console.error('No user found in localStorage.');
    }
  }

  /**
   * Toggles a movie as a favorite for the user.
   * Adds the movie to or removes it from the user's favorites list.
   * Updates localStorage and refreshes the movie list.
   * @param movie - The movie to modify in the favorites list.
   */
  modifyFavoriteMovies(movie: any): void {
    if (!this.user || !this.user.FavoriteMovies) {
      console.error('User or favoriteMovies is undefined.');
      return;
    }

    if (this.isFavorite(movie)) {
      this.fetchApiData.deleteFavoriteMovie(this.user.Username, movie._id).subscribe(
        (res) => {
          console.log('Removed from favorites:', res);
          this.user.FavoriteMovies = res.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.getMovies();
        },
        (err) => console.error('Error removing from favorites:', err)
      );
    } else {
      this.fetchApiData.addFavoriteMovie(this.user.Username, movie._id).subscribe(
        (res) => {
          console.log('Added to favorites:', res);
          this.user.FavoriteMovies = res.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.getMovies();
        },
        (err) => console.error('Error adding to favorites:', err)
      );
    }
  }

  /**
   * Checks if a movie is in the user's favorites list.
   * @param movie - The movie to check.
   * @returns `true` if the movie is a favorite, otherwise `false`.
   */
  isFavorite(movie: any): boolean {
    return this.user.FavoriteMovies?.includes(movie._id) || false;
  }

  /**
   * Displays an alert with the provided message.
   * @param msg - The message to display in the alert.
   */
  getMsg(msg: any): void {
    alert(msg);
  }
}
