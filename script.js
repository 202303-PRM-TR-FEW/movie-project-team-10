"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  console.log(movies);
  const myCarouselElement = document.querySelector("#carousel");

  const content = movies.map((movie) => {
    const movieDiv = document.createElement("div");
    const movieBtn = `
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#movieModal"
      >
        Details
      </button>`;
    movieDiv.innerHTML = ` 
    <div class="card" style="width: 18rem; margin-bottom: 10PX;">
      <img src="${
        BACKDROP_BASE_URL + movie.backdrop_path
      }" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title text-center">${movie.title}</h5>
        <p class="card-text">${movie.overview.slice(0, 100)}</p>
        <p class="card-text ">vote Average: ${movie.vote_average}</p>
        <p class="card-text">vote Count: ${movie.vote_count}</p>    
      </div>
    </div>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });

  myCarouselElement.innerHTML = "<div class='carousel'>" + content + "</div>";
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);


// About Page /w inner HTML

const aboutPage = () => {
  CONTAINER.innerHTML=`
  <div class="about-container">
    <p class="about-text">" When We wrote this code, only god and we knew how it worked. Now, only god knows it! "</p>
    <p class="about-text2"> - Anonymous</p>
    <p class= "imageContainer"><img class="aboutImage" src="images/dogecoin-2-1-1138x640.jpg"></p>
  </div>`
}

const aboutBtn = document.querySelector("#aboutBtn");
aboutBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";
  aboutPage();
});