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

  constructor(public fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.getMovies();
    this.loadUserData();
  }

  // Fetch all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies:', this.movies);
    });
  }

  // Load user data from localStorage
  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log('Loaded user:', this.user);
    } else {
      console.error('No user found in localStorage.');
    }
  }

  // Add or remove a movie from the user's favorites
  modifyFavoriteMovies(movie: any): void {
    if (!this.user || !this.user.FavoriteMovies) {
      console.error('User or favoriteMovies is undefined.');
      return;
    }

    if (this.isFavorite(movie)) {
      // Remove from favorites
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
      // Add to favorites
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

  // Check if a movie is in the user's favorites
  isFavorite(movie: any): boolean {
    return this.user.FavoriteMovies?.includes(movie._id) || false;
  }

  // Display a message in an alert
  getMsg(msg: any): void {
    alert(msg);
  }
}
