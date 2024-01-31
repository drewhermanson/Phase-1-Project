var resultsEl;
var favHistoryBtnEl;
var favHistoryEl;


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
        var resultCardContentEl = document.createElement('div');
        resultCardContentEl.classList.add('card-content');
        //Add actual values for weather
        resultCardContentEl.innerHTML = 'High temp: ' + resultObj[i].high_temp + '</br> Humidity: ' + resultObj[i].humidity;
        var favBtnEl = document.createElement('button');
        favBtnEl.classList.add('button', 'is-info');

    }
}

// Save favorited item to local storage

//Get favorited items from local storage