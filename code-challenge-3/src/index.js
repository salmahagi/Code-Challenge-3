document.addEventListener("DOMContentLoaded", () => {
    // Base URL
    const baseUrl = 'http://localhost:3000/films/1';
  
    // Fetch and display the first movie's details
    fetch(baseUrl)
      .then(response => response.json())
      .then(movie => displayMovieDetails(movie))
      .catch(err => console.error("Failed to fetch movie details", err));
    
    // Function to display movie details
    function displayMovieDetails(movie) {
      const { title, runtime, capacity, tickets_sold, showtime, poster, description } = movie;
      const availableTickets = capacity - tickets_sold;
      
      // Update the DOM elements
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("film-info").textContent = description;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;
      document.getElementById("poster").src = poster;
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const allMoviesUrl = 'http://localhost:3000/films';
    
    // Fetch and display all movies in the sidebar
    fetch(allMoviesUrl)
      .then(response => response.json())
      .then(movies => {
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";  // Clear placeholder
        
        movies.forEach(movie => {
          const movieItem = document.createElement("li");
          movieItem.classList.add("film", "item");
          movieItem.textContent = movie.title;
          
          // Add click event to display movie details
          movieItem.addEventListener("click", () => {
            displayMovieDetails(movie);
          });
          
          filmsList.appendChild(movieItem);
        });
      })
      .catch(err => console.error("Failed to fetch movies", err));
  });
  
  
  document.addEventListener("DOMContentLoaded", () => {
    let currentMovie;
  
    document.getElementById("buy-ticket").addEventListener("click", () => {
      if (!currentMovie) return;
      
      const availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
      
      if (availableTickets > 0) {
        currentMovie.tickets_sold += 1;
  
        // Persist the update to the server
        fetch(`http://localhost:3000/films/${currentMovie.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tickets_sold: currentMovie.tickets_sold
          })
        })
          .then(response => response.json())
          .then(updatedMovie => {
            // Update DOM with the new ticket number
            document.getElementById("ticket-num").textContent = `${updatedMovie.capacity - updatedMovie.tickets_sold} remaining tickets`;
          })
          .catch(err => console.error("Failed to update ticket", err));
      } else {
        alert("Sorry, this movie is sold out.");
      }
    });
  
    // Function to display movie details (modified)
    function displayMovieDetails(movie) {
      currentMovie = movie;
      const { title, runtime, capacity, tickets_sold, showtime, poster, description } = movie;
      const availableTickets = capacity - tickets_sold;
  
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("film-info").textContent = description;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;
      document.getElementById("poster").src = poster;
    }
  });

  if (availableTickets === 0) {
    document.getElementById("buy-ticket").textContent = "Sold Out";
    document.getElementById("buy-ticket").disabled = true;
  }
   

  function addDeleteButton(movieItem, movieId) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("ui", "red", "button");
  
    deleteButton.addEventListener("click", () => {
      fetch(`http://localhost:3000/films/${movieId}`, {
        method: "DELETE"
      })
        .then(() => {
          movieItem.remove();  // Remove movie from DOM
        })
        .catch(err => console.error("Failed to delete movie", err));
    });
  
    movieItem.appendChild(deleteButton);
  }
  