"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsContainer = document.getElementById("actorsContainer");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  // console.log(movies)
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
  const movieCast = await fetchCast(movie.id);
  const relatedMovies = await fetchRelatedMovies(movie.id);
  const director = await fetchDirector(movie.id);
  const trailers = await fetchTrailers(movie.id);
  renderMovie(movieRes, movieCast, relatedMovies, director, trailers);
  // console.log(trailers);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

//function for fetching related movies
const fetchRelatedMovies = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};

//function for fetching trailers
const fetchTrailers = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data;
};

//function for fetching director
const fetchDirector = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  return data.crew.find((cast) => cast.job === "Director");
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = "";
  // console.log(movies);
  const myCarouselElement = document.querySelector("#carousel");

  const content = movies.forEach((movie) => {
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
    <div class="card">
    <figure  class=" snip1577"  style="width: 18rem; margin-bottom: 10PX;">
      <img src="${
        BACKDROP_BASE_URL + movie.backdrop_path

      }" class="card-img-top rounded " />
      <figcaption>
        <h6 class="card-title text-center">${movie.overview.slice(0, 80)}...</h6>
        <br>
        <h4 class="card-text "><b>Vote Average:</b> ${movie.vote_average}</h4>
        <h4 class="card-text"><b>Vote Count:</b> ${movie.vote_count}</h4>    
      </figcaption>
    </figure>
    <h6 class="card-title text-center">${movie.title}</h6>
    </dive>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });

  myCarouselElement.innerHTML = "<div class='carousel'>" + content + "</div>";
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, movieCast, relatedMovies, director, trailers) => {
  console.log(movie);
  CONTAINER.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img id="movie-backdrop" src=${
          movie.poster_path == null
            ? "images/movieLogo2.jpg"
            : BACKDROP_BASE_URL + movie.poster_path
        } >
      </div>
      <div class="col-md-8">
        <h2 id="movie-title">${movie.title}</h2>
        <p id="movie-release-date"><b>Release Date:</b> ${
          movie.release_date
        }</p>
        <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
        <p id="movie-language"><b>Language:</b> ${movie.spoken_languages.map(
          (languge) => `${languge.english_name}`
        )}</p>
        <p id="director"><b>Director:</b> ${director.name}</p> 
        <p id="voteAvarage"><b>Vote Average:</b> ${movie.vote_average}</p>
        <p id="voteCount"><b>Vote Count:</b> ${movie.vote_count}</p>
        <p id="movie-production"><b>Production:</b> ${movie.production_companies.map(
          (company) =>
            `<img id="production-img" src="${
              company.logo_path == null
                ? "images/movieLogo2.jpg"
                : BACKDROP_BASE_URL + company.logo_path
            }" alt="${company.name}" style="height:60px;"`
        )}</p>      
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>     
      </div>
    </div>

    <div class="row">
      <h3>Trailer:</h3>
      <div id="movie-trailer">
        <iframe class="trailer" src="https://www.youtube.com/embed/${
          trailers.results[0].key
        }?autoplay=1" style="height:300px;width:600px;"></iframe>
      </div>
    </div> 

    <div class="row ">
      <h3>Actors:</h3>

      <ul id="actors" class="list-unstyled list-group list-group-horizontal-md"></ul>
    </div>    
    <div class="row">
    <h3>Related Movies:</h3>  
    <ul id="relatedMoviesList" class=" list-unstyled list-group list-group-horizontal-md"></ul>
    </div>`;
  // console.log(movieCast);

  renderCast(movieCast);
  renderRelatedMovies(relatedMovies);
};

//function for related movies
const renderRelatedMovies = (relatedMovies) => {
  // console.log(relatedMovies);
  const relatedMoviesList = document.querySelector("#relatedMoviesList");
  relatedMovies.slice(0, 5).map((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("rounded");
    movieCard.innerHTML = `
    <div class="card" style=" margin: 5px;">
    <img id="movie-img" src="${
      movie.backdrop_path == null
        ? "images/movieLogo2.jpg"
        : BACKDROP_BASE_URL + movie.backdrop_path
    }" class="card-img-top img-fluid rounded" />
    <div class="card-body">
      <h5 class="card-title text-center">${movie.title.slice(0, 19)}</h5>
      </div>
  </div>`;
    relatedMoviesList.appendChild(movieCard);
    movieCard.addEventListener("click", () => {
      movieDetails(movie);
    });
  });
};

//Actors Page
const actorsButton = document.getElementById("actorsButton");

//function for listing actors on the Actors Page
const actorsList = async () => {
  const actors = await fetchActors();
  renderActors(actors);
  // console.log(actors);
};

actorsButton.addEventListener("click", actorsList);

//function for fetching actors
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};

//function for fetching one actor
//returns actorRes

const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data);
  return data;
};

//fetch function for movies of a actor
//returns movieRes
const fetchActorMovies = async (person_id) => {
  const url = constructUrl(`person/${person_id}/movie_credits`);
  const res = await fetch(url);
  const data = await res.json();
  const movieRes = data.cast;
  const knownFor = document.querySelector("#knownFor");
  console.log(knownFor)
  const movieCardList = document.createElement("ul");
  movieCardList.setAttribute(
    "class",
    "list-unstyled list-group list-group-horizontal-md "
  );
  for (let i = 0; i <= 4; i++) {
    const movieCard = document.createElement("div");
    movieCard.innerHTML = `    
    <div class="card" style="margin: 5px;">
    <img id="movie-img" src="${
      movieRes[i].backdrop_path == null
        ? "images/movieLogo2.jpg"
        : PROFILE_BASE_URL + movieRes[i].backdrop_path
    }" class="card-img-top img-fluid" />
    <div class="card-body">
      <h5 class="card-title">${
      movieRes[i].title
    }</h5>
      </div>
  </div>
`;
    movieCardList.appendChild(movieCard);
    knownFor.appendChild(movieCardList);
    movieCard.addEventListener("click", () => {
      movieDetails(movieRes[i]);
    });
  }
};

//function for actor infos
const actorInfo = async (actor) => {
  // console.log(actor);
  const actorRes = await fetchActor(actor.id);
  // const movieRes = await fetchActorMovies(actor.id);
  // console.log(movieRes);
  renderActor(actorRes);
};

//Function for creating Actor page
const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div");
  actorsContainer.setAttribute("class", "actorsList");

  actors.map((actor) => {
    const actorCard = document.createElement("div");
    actorCard.innerHTML = `    
    <div class="card mb-3" style="width: 12rem;">
    <img id="actor-img" src="${
      actor.profile_path == null
        ? "images/avatar.svg"
        : PROFILE_BASE_URL + actor.profile_path
    }" class="card-img-top rounded img-fluid" >
      <div class="card-body">
      <h5 class="card-title">${actor.name}</h5>
      </div>
      </div> `;

    actorCard.addEventListener("click", () => {
      actorInfo(actor);
      // console.log(actors);
    });

    actorsContainer.appendChild(actorCard);
    CONTAINER.appendChild(actorsContainer);
  });
};

//function for rendering single actor info
const renderActor = (actor) => {
  // console.log(actor);
  CONTAINER.innerHTML = "";
  CONTAINER.innerHTML = `
  <div class="row justify-content-center">    
    <div class="actorDiv">
      <img id="actor-img" src="${
        actor.profile_path == null
          ? "images/avatar.svg"
          : PROFILE_BASE_URL + actor.profile_path
      }">
    </div>
    <div>  
      <h3 id="actor-name">${actor.name}</h3>      
      <h5>Gender:</h5>
        <p class="actorInfo"> ${actor.gender == 1 ? "Female" : "Male"}</p>  
      <h5>Popularity:</h5>
        <p class="actorInfo">${actor.popularity}</p>
      <h5>Birthday:</h5>
        <p class="actorInfo">${
          actor.birthday == null ? "-" : actor.birthday
        }</p>
      <h5>Deathday:</h5>
        <p class="actorInfo">${
          actor.deathday == null ? "-" : actor.deathday
        }</p>
      <h5>Biography</h5>
      <p class="actorInfo" id="biography">${
        actor.biography == "" ? "-" : actor.biography
      }</p>
    </div>
  </div>
  <div class="row" >
  <h3>Related Movies:</h3>
  <div class="row justify-content-center " id="knownFor">    
   
      </div></div>     
     `;
  fetchActorMovies(actor.id);
};

//function for fetching movie cast

const fetchCast = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast);
  return data.cast;
};

// function for displaying cast of a movie

const renderCast = (movieCast) => {
  const cast = document.querySelector("#actors");
  movieCast.slice(0, 5).map((actor) => {
    const actorCard = document.createElement("li");
    actorCard.classList.add("card");
    actorCard.innerHTML = `  
    <li class="card list-group-item m-2" style="border: 1px solid rgba(0, 0, 0, 0.5);  background-color: black;"><img id="actor-img" src="${
      actor.profile_path == null
        ? "images/avatar.svg"
        : PROFILE_BASE_URL + actor.profile_path
    }" class="card card-img-top rounded img-fluid" ><h5 class="card-title  text-center">${actor.name}</h5>     
      </li>
    `;
    cast.appendChild(actorCard);
    actorCard.addEventListener("click", () => {
      actorInfo(actor);
    });
  });

  // console.log(movieCast);
};

document.addEventListener("DOMContentLoaded", autorun);

// About Page /w inner HTML

const aboutPage = () => {
  CONTAINER.innerHTML = `
  <div class="about-container">
    <p class="about-text">" When We wrote this code, only god and we knew how it worked. Now, only god knows it! "</p>
    <p class="about-text2"> - Anonymous</p>
    <p class= "imageContainer"><img class="aboutImage" src="images/dogecoin-2-1-1138x640.jpg"></p>
  </div>`;
};

const aboutBtn = document.querySelector("#aboutBtn");
aboutBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";
  aboutPage();
});

/// filter and genre dropdown section

// fetching genre and adding element to the movie dropdown
const dropDownContent = document.getElementById("dropdown-movie");
const url = constructUrl("genre/movie/list");
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.genres.forEach((genre) => {
      const options = document.createElement("li");
      dropDownContent.appendChild(options);

      const option = document.createElement("a");
      options.appendChild(option);
      option.classList.add("dropdown-item");
      option.value = genre.id;
      option.href = "#";
      option.textContent = genre.name;

      option.addEventListener("click", function (event) {
        const genreId = genre.id;
        genreIdfetcher(genreId);
      });
    });
  });

// Handeler of fetching the genre based on the selected id
function genreIdfetcher(id) {
  fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0&with_genres=${id}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      renderMovies(data.results);
    });
}

// Handeling and ftching the dropdown filter

function fetchingAndAssigninFilterDropDown() {
  // Filtering popularity
  const dropdownPopular = document.getElementById("popular-drop-item");
  dropdownPopular.addEventListener("click", () => {
    fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0`
    )
      .then((resp) => resp.json())
      .then((data) => {
        renderMovies(data.results);
      });
  });

  // Filtering top rated movies
  const dropdowntopRated = document.getElementById("topRated-drop-item");
  dropdowntopRated.addEventListener("click", () => {
    fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0`
    )
      .then((resp) => resp.json())
      .then((mata) => {
        renderMovies(mata.results);
      });
  });

  // Filtering Now playing movies
  const dropdownNowPlaying = document.getElementById("nowPlaying-drop-item");
  dropdownNowPlaying.addEventListener("click", () => {
    fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0`
    )
      .then((resp) => resp.json())
      .then((data) => {
        renderMovies(data.results);
      });
  });

  // Filtering upcoming movies
  const dropdownUpComing = document.getElementById("upComing-drop-item");
  dropdownUpComing.addEventListener("click", () => {
    fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0`
    )
      .then((resp) => resp.json())
      .then((data) => {
        renderMovies(data.results);
      });
  });

  const home = document.getElementById("home-button");
  home.addEventListener("click", () => {
    fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=7bdd4afb1f1beea5c5d1ed26587d9ea0`
    )
      .then((resp) => resp.json())
      .then((data) => {
        renderMovies(data.results);
      });
  });
}

fetchingAndAssigninFilterDropDown();


// search implementations

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', handleInput);


function handleInput() {
  const inputValue = searchInput.value;
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${inputValue}&page=1&include_adult=false`)
  .then((resp) => resp.json())
      .then((data) => {
        renderMovies(data.results);
      });
}



