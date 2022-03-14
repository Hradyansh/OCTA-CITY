const searchInputForm = document.querySelector(".searchFieldForm");
const searchInputField = searchInputForm.querySelector(".searchInput");
const searchInputFieldButton = document.querySelector(".search_Button");
const footer = document.querySelector(".footer");
const displayDiv = document.querySelector(".display_tag");
const searchDropDown = document.querySelector('.dropdown-menu')


//********
//STATES
let movieSearch = [];
let movieData = [];
let query = "";
let fav = [];
//********


//--------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
//--------------------------------------------------------------------------------------------------


//SEARCH MOVIE BY KEY-WORD
async function searchMovie(query, pageNumber) {
  movieSearch = [];
  movieData = [];
  console.log(pageNumber);
  let url = `https://www.omdbapi.com/?s=${query}&page=${pageNumber}&apikey=2b172a0c`;
  const response = await fetch(url);

  const data = await response.json();

  if (data.Response === "False") {
    console.log("here");
    return;
  } else {
    console.log(data.Response);
    console.log(data);
    console.log(data.Search);
    data.Search.map((el) => {
      if (el.Type === "movie") {
        movieSearch.push(el);
      }
    });
  }
}

// -------------
// FETCH SINGLE-MOVIE-SEPCIFIC DATA USING ID-IMDB
async function getMovieData(id) {
  // console.log(pageNumber);
  let url = `https://www.omdbapi.com/?i=${id}&apikey=2b172a0c`;
  const response = await fetch(url);

  const data = await response.json();

  console.log(data.Response);
  console.log(data);
  console.log(data.Search);

  movieData.push(data);
  display(movieData);
}

let searchTimeOutToken = 0;
searchInputField.addEventListener('keyup', (event) => {
  // console.log(searchInputField.value);
  clearTimeout(searchTimeOutToken);

  searchTimeOutToken = setTimeout(() => {
    searchMovie(searchInputField.value, 1).then(() => {
      console.log(movieSearch);

      let html = "";

      movieSearch.map((element, i) => {
        html += `
      <a class="dropdown-item list-group-item list-group-item-action" href="#">${element.Title}</a>
      `;
      }).join("")

      searchDropDown.innerHTML = html;

    });
  }, 450)
})



//TRANSFER TO LOCAL STORAGE FAV MOVIES SO THAT IT CAN BE SHARED ON ANOTHER PAGE
function transferInLocalStorage() {
  localStorage.setItem('favList', JSON.stringify(fav))
}

function transferbackFromLocalStorage() {
  const lsItems = JSON.parse(localStorage.getItem('favList'));
  if (lsItems.length) {
    fav.push(...lsItems);
    window.dispatchEvent(new CustomEvent('favListUpdated'))
  }
}





//DISPLAY FUNCTION
function display(movieData) {
  let html = "";

  movieData
    .map((item, i) => {
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
    })
    .join("");

  displayDiv.innerHTML = html;
  footer.innerHTML = `<footer class="py-3 my-4 row justify-content-evenly ">
      <button class="btn btn-primary col-2 mb-2 next" type="button" name="prev">PREV</button>
      <button class="btn btn-primary col-2 mb-2 prev" type="button" name="next">NEXT</button>
    </footer>`;
}

//NEXT/PREV BUTTON FUNCTIONALITY
nextPageCount = 2;
prevPageCount = 0;

function handleNextClick(event) {
  searchMovie(query, nextPageCount)
    .then(() => {
      console.log(movieSearch);
      // display(movieSearch)
      if(movieSearch.length){
        // console.log("************", movieSearch.length);
        nextPageCount += 1;
      }else{
        nextPageCount=nextPageCount;
      }

    })
    .then(() => {
      movieSearch.forEach((item, i) => {
        getMovieData(item.imdbID);
      });
    });
}

function handlePrevClick(event) {
  prevPageCount = nextPageCount - 1;
  if (prevPageCount == 0 || nextPageCount == 1) {
    return;
  }
  searchMovie(query, prevPageCount)
    .then(() => {
      console.log(movieSearch);
      // display(movieSearch)
      if(movieSearch.length > 0){
        // console.log("************", movieSearch.length);
        nextPageCount = nextPageCount - 1;
      }else{
        prevPageCount=1;
      }
    })
    .then(() => {
      movieSearch.forEach((item, i) => {
        getMovieData(item.imdbID);
      });
    });
}



//--------------------------------------------------------------------------------------------------
// LISTENERS
//--------------------------------------------------------------------------------------------------


//SEARCH INPUT ENTER
searchInputForm.addEventListener("submit", (event) => {
  // console.log(searchInputField.value);
  query = searchInputField.value;
  console.log("here");
  event.preventDefault();

  var nextPageCount = 1;
  var prevPageCount = 0;
  searchMovie(searchInputField.value, nextPageCount)
    .then(() => {
      console.log(movieSearch);
      // display(movieSearch)
    })
    .then(() => {
      movieSearch.forEach((item, i) => {
        getMovieData(item.imdbID);
      });
    })
    .then(() => {
      transferInLocalStorage();
    });
});

//Search Input Dropdow Listeners
searchDropDown.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    console.log(event.target.innerText);
    searchInputField.value = event.target.innerText;
  } else {
    return;
  }
})


//NEXT /PREV Buttons
footer.addEventListener("click", (event) => {
  //NEXT BUTTON
  console.log(event.target.name);
  if (event.target.name === "next") {
    handleNextClick(event);
  }

  //PREV BUTTON
  if (event.target.name === "prev") {
    handlePrevClick(event);
  }
});

//INFO BUTTOn CLICK
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

//ADD TO FAV BOUUTON CLICK
displayDiv.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.name === 'fav') {

    console.log(event.target.name, event.target.id);
    if (event.target.name === 'fav') {
      if (!fav.includes(event.target.id)) {
        console.log('here', fav);
        fav.push(event.target.id)
        // callLocalStorage;
        transferInLocalStorage();
      } else {
        alert('Added Already!');
      }
    }
  }
});
