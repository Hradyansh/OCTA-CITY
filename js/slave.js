const displayDiv = document.querySelector('.movie_Info')

//********
//STATES
let movieData = [];
//********

//------------------------------------------------------------------------------
//HELPER FUNCTIONS
//------------------------------------------------------------------------------

//FETCH FUNCTION BY SENDING ID
async function getMovieData(id) {
  // console.log(pageNumber);
  let url = `http://www.omdbapi.com/?i=${id}&apikey=2b172a0c`;
  const response = await fetch(url);

  const data = await response.json();

  console.log(data.Response);
  console.log(data);
  console.log(data.Search);


  movieData.push(data);
  display(movieData)

}


//DISPLAY FUNCTION
function display(movieData) {
  let html="";

  movieData.map((item, i) => {
    html += `
    <div class="card mb-3 col-8" style="background-color: rgb(227, 227, 227)" >
      <img class="align-self-center p-4 border border-dark border-5 rounded mt-3" src="${item.Poster}" alt="" style="width:50vw;">
      <div class="card-body text-center">
        <h5 class="card-title">${item.Title}</h5>
        <div class="card-text">
        <p class="fw-bold">Actors : <span class="fw-normal">${item.Actors}</span></p>
        <p class="fw-bold">Awards : <span class="fw-normal">${item.Awards}</span></p>
        <p class="fw-bold">BoxOffice : <span class="fw-normal">${item.BoxOffice}</span></p>
        <p class="fw-bold">Country : <span class="fw-normal">${item.Country}</span></p>
        <p class="fw-bold">DVD : <span class="fw-normal">${item.DVD}</span></p>
        <p class="fw-bold">Director : <span class="fw-normal">${item.Director}</span></p>
        <p class="fw-bold">Genre : <span class="fw-normal">${item.Genre}</span></p>
        <p class="fw-bold">Language : <span class="fw-normal">${item.Language}</span></p>
        <p class="fw-bold">Plot : <span class="fw-normal">${item.Plot}</span></p>
        <p class="fw-bold">IMDB Rating : <span class="fw-normal">${item.imdbRating}</span></p>
        </div>
      </div>
    </div>

    `;
  }).join('');

  displayDiv.innerHTML = html;

}

//------------------------------------------------------------------------------
//LISTENERS
//------------------------------------------------------------------------------

//FUCNTION TO GET ID FROM THE URL
window.onload = function () {
  var url = document
  .location.href,
  params = url.split('?')[1],
  console.log(params.split('=')[1]);
  let imdbID =  params.split('=')[1];
  getMovieData(imdbID);

}
