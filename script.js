const apiKey = "e314295";

const searchTerms = ["batman", "avengers", "spider", "harry", "fast", "superman"];

const moviesContainer = document.getElementById("moviesContainer");
const status = document.getElementById("status");
const sortSelect = document.getElementById("sortSelect");

let movies = [];

async function fetchMovies() {
  try {
    const requests = searchTerms.map((term) =>
      fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}`).then((res) =>
        res.json()
      )
    );

    const results = await Promise.all(requests);

    const combinedMovies = results
      .filter((data) => data.Search)
      .flatMap((data) => data.Search.slice(0, 1));

    movies = combinedMovies.slice(0, 6);

    if (movies.length === 0) {
      status.textContent = "No movies found.";
      return;
    }

    status.style.display = "none";
    sortAndRender(sortSelect.value);
  } catch (error) {
    status.textContent =
      "Error loading movies. Please check your API key or internet connection.";
    console.error("Fetch error:", error);
  }
}

function renderMovies(movieList) {
  moviesContainer.innerHTML = "";

  movieList.forEach((movie) => {
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Type:</strong> ${movie.Type}</p>
        <p><strong>IMDb ID:</strong> ${movie.imdbID}</p>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}

function sortAndRender(sortType) {
  const sortedMovies = [...movies];

  if (sortType === "az") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "za") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortType === "oldest") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  renderMovies(sortedMovies);
}

sortSelect.addEventListener("change", (event) => {
  sortAndRender(event.target.value);
});

fetchMovies();