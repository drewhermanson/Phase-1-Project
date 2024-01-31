var resultsEl;
var favHistoryBtnEl;
var favHistoryEl;
var savedFavorites = [];

// Creates array of randomized index numbers

// Fetches data based on user input

// Function to find a place that matches the desired weather


// Get user input for desired weather


// Get user input for days of the year


// Find a place that matches the desired weather


// Display the search results on page

function printSearchResults(resultObj){

    //need an if statement in here to filter results!
    for (var i = 0; i < resultObj.length; i++) {
        var resultCardEl = document.createElement('div');
        resultCardEl.classList.add('card');
        var resultCardHeaderEl = document.createElement('div');
        resultCardHeaderEl.classList.add('card-header');
        //Add actual value for city name
        resultCardHeaderEl.innerHTML = resultObj[i].name;
        resultCardEl.append(resultCardHeaderEl);
        var resultCardContentEl = document.createElement('div');
        resultCardContentEl.classList.add('card-content');
        //Add actual values for weather
        resultCardContentEl.innerHTML = 'High temp: ' + resultObj[i].high_temp + '</br> Humidity: ' + resultObj[i].humidity;
        var favBtnEl = document.createElement('button');
        favBtnEl.classList.add('button', 'is-info');
        resultCardContentEl.append(favBtnEl);
        resultCardEl.append(resultCardContentEl);

        resultsEl.append(resultCardEl);

    }
}

//Read stored favorites
function readStoredFavorites() {
    var favorites = localStorage.getItem('savedPlaces');
    if (favorites) {
        savedFavorites = JSON.parse(favorites);
    } else {
        savedFavorites = [];
    }
}

// Save favorited item to local storage
//Need to add a click listener for this
 function saveSearchResult(event) {
  var favoritedResults = readStoredFavorites();
  //Update these to match the API values
  var location = {
    city: cityName,
    lat: latitude,
    lon: longitude,
    temp: highTemp,
    humidity: humidity, 
    startDate: startDate,
    endDate: endDate
  };
  favoritedResults.push(location);
  localStorage.setItem('savedPlaces', JSON.stringify(favoritedResults));
 }


//Get favorited items from local storage and display in modal

function openSavedFavorites() {
    //need the actual name of the modal & click listener for this function
    favHistoryEl.classList.add('is-active')
    printFavorites();
}

//Close modal with favorites history
    // need the actual name of the modal & click listener for this function

function closeSavedFavorites() {
    favHistoryEl.classList.remove('is-active');
    }

//Print data in modal

function printFavorites(){
    //Double check this
    if (savedFavorites) {
        for (i = 0; i < savedFavorites.length; i++){
            //Add empty UL in the modal HTML
            var savedResult = document.createElement('li');
            savedResult.innerHTML = '<b>' + savedFavorites[i].city + '</b>: ' + savedFavorites[i].startDate + ' to ' + savedFavorites[i].endDate + '(' + savedFavorites[i].temp + 'F, Humidity: ' + savedFavorites[i].humidity + ')';
            favHistoryEl.append(savedResult);
        }
    }

}