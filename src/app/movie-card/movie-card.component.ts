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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.map((movie: any) => {
        console.log('ImagePath:', movie.ImagePath);
        return movie;
      });
      console.log('Movies:', this.movies);
    });
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log('Loaded user:', this.user);
    } else {
      console.error('No user found in localStorage.');
    }
  }

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

  isFavorite(movie: any): boolean {
    return this.user.FavoriteMovies?.includes(movie._id) || false;
  }

  getMsg(msg: any): void {
    alert(msg);
  }
}
