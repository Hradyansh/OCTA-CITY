const displayDiv = document.querySelector('.display_tag');


//********
//STATES
let fav =[];
let favMovies = [];
//********

//------------------------------------------------------------------------------
//HELPER FUNCTIONS
//------------------------------------------------------------------------------

//FETCH FROM LOCAL STORAGE ALL THE LIKED MOVIES
function transferInLocalStorage() {
  localStorage.setItem('favList', JSON.stringify(fav))
}

function transferbackFromLocalStorage() {
  const lsItems =JSON.parse(localStorage.getItem('favList'));
  if(lsItems.length) {
    fav.push(...lsItems);
    window.dispatchEvent(new CustomEvent('favListUpdated'))
  }
}

window.onload = function() {
  transferbackFromLocalStorage();
}

//FETCH MOVIE FROM API USING ID
async function fetchMovieDate(id){

  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=2b172a0c`);

  const data = await response.json();

  console.log(data);
  favMovies.push(data);

}


//DISPLAY FUNCTION
function display(favMovies) {
  let html = "";

  favMovies.map((item, i) => {
    html += `
    <div class="movie_tile card-body  bg-dark text-light col" style="max-width:220px;">
      <div class="card-img-top">

        <div class="card-body text-center img_description ">
          <div class="card-text rateing_logo">
            <img src="https://img.icons8.com/fluency/344/star.png" alt="star" style="height:16px;">
          </div>
          <div class="card-text rateing_value">
            ${item.imdbRating}/10
          </div>
          <div class="card-text gener">
            ${item.Genre}
          </div>
          <br>
          <button type="button"  class="btn btn-primary show_moreBtn">
          <a href="./moviePage.html" target="_blank" name="infoBtn" id=${item.imdbID} style="text-decoration: none;color:white">INFO</a>
          </button>


          <button class="btn btn-primary add_to_favBtn" name="fav" id=${item.imdbID}>
            <img id=${item.imdbID} name="fav" src="https://img.icons8.com/external-kmg-design-basic-outline-kmg-design/344/external-love-user-interface-kmg-design-basic-outline-kmg-design.png" alt="fav" style="height:24px;">
          </button>
        </div>

        <div style="border: 2px solid green;height:250px; width:180px; margin:0;padding:0;">
          <img src="${item.Poster}" alt="" style="border: 2px solid green;height:100%; width:100%; margin:0;padding:0;">
        </div>
      </div>

      <div class="card-text movie_name text-light">
        ${item.Title}
      </div>
      <div class="card-text release_date text-muted">
        ${item.Year}
      </div>
    </div>

    `;
  }).join('')

  displayDiv.innerHTML = html;
}



// -----------------------------------------------------------------------------
//LISTENERS
// -----------------------------------------------------------------------------

//When LIST UPDATED
window.addEventListener('favListUpdated', () => {
  fav.forEach((id, i) => {

    fetchMovieDate(id).then(() => {
      display(favMovies)
    });
  });

  display(favMovies);
})

//WHEN INFO CLICKED
displayDiv.addEventListener("click", (event) => {
  if (event.target.name === 'fav') {
    return;
  }else if (event.target.name === 'infoBtn'){

    console.log(event.target.name, event.target.id);
    console.log(event.target.href);
    event.preventDefault();

    let url = `${event.target.href}?id=` + encodeURIComponent(event.target.id);
    window.open(url, "_blank");

  }
});
