var resultsEl;
var favHistoryBtnEl;
var favHistoryEl;
var savedFavorites = [];
//Drew: array for randomly generated city numbers
var cityCodes = [];
//Drew: array of city names from api using the randomly generated city numbers
var selectedCities = [];
//Drew: array of objects that CURRENTLY include city name, temp, and tempstatus(hot,cold,warm,etc)
var finishedCities = [];

// Creates array of randomized index numbers
function getRandomCities() {  

        for (var i = 0; i < 10; i++){
    
        var num = Math.floor(Math.random() * 4503);
        cityCodes.push(num);
        }
}

// Fetches data based on user input
//Drew: function to get city names from api using the randomly generated city numbers
function getCityNames() {

        var cityApi = "https://countriesnow.space/api/v0.1/countries/population/cities";
    
        //Drew: fetch statement that first sends us 4503 cities
        fetch(cityApi).then(function (response) {
                if (response.ok) {
                        response.json().then(function (cities) {
                                for (var i = 0; i < 10; i++) {
                                        //Drew: selects the city name from the position in the array from the randomly generated city numbers array.
                                        selectedCities[i] = cities.data[cityCodes[i]].city;
                                        //Drew: checks and removes certain markings in the city data. Otherwise normal data is fine.
                                        if (selectedCities[i].includes("(")) {
                                                selectedCities[i] = selectedCities[i].split(" (")[0];
                                        }
                                        //Drew:  Replace spaces and ' with underscores so it can be used in the weather api url
                                        selectedCities[i] = selectedCities[i].replace(/\s/g, "_");
                                        selectedCities[i] = selectedCities[i].replace(/'/g, "_");
                                }
                                //Drew: send getWeatherData the cities array now that its formatted
                                getWeatherData(selectedCities);
                        });
                }
            });    
    }
    
    //Drew: function to get weather data for all cities
    function getWeatherData(selectedCities) {
    
        //Drew: array to temporarily hold the weather data
        var tempWeather = [];
    
        //Drew:  fetchedPromises is an array of promises. .map function will iterate through the selectedCities array and create a new array of promises.
        var fetchPromises = selectedCities.map(function(city) {
    
                //Drew: will need to code user stated date ranges
                var weatherApi = "https://api.weatherbit.io/v2.0/history/daily?&city=" + city + "&start_date=2024-01-24&end_date=2024-01-25&Units=I&key=6f251738284f43388d62e002e46361af";
    
                //Drew: individual fetch for weather data
                return fetch(weatherApi)
                        .then(function(response) {
                                //Drew: checks for a positive response
                                if (response.ok) {
                                        return response.json();
                                //Drew: bad response results in an error message, but i(drew) did lots of tests and have never gotten this.
                                } else {
                                        throw new Error("Error fetching weather data for " + city);
                                }
                        })
                        .then(function(weather) {
                                //Drew: adds the cities weather data to the tempWeather array
                                tempWeather.push(weather.data[0].temp);
                        });
        });
    
        //Drew:  After all the fetches are done, it takes all the promises and pushes them to weatherEval.
        Promise.all(fetchPromises)
                .then(function() {
                        weatherEval(tempWeather, selectedCities);
                })
                .catch(function(error) {
                        console.error(error);
                });
    }


// Function to find a place that matches the desired weather
//Drew: function that checks the temp and assigns a status to it. Also puts the information into an object and then into an array.
function weatherEval(tempWeather, selectedCities) {
        //Drew: array of objects
        finishedCities = [];
    
        for (var i = 0; i < selectedCities.length; i++) {
                //Drew: individiual object
                var cityObj = {
                        name: selectedCities[i],
                        temp: tempWeather[i],
                        tempstatus: ""
                };
                //Drew: checks the temp and assigns a status to it
                if (cityObj.temp < 75 && cityObj.temp >= 55) {
                        cityObj.tempstatus = "mild";
                } else if (cityObj.temp >= 75) {
                        cityObj.tempstatus = "hot";
                } else if (cityObj.temp < 55 && cityObj.temp >= 32) {
                        cityObj.tempstatus = "cold";
                } else {
                        cityObj.tempstatus = "arctic";
                }
                //Drew: pushes the object into the array
                finishedCities.push(cityObj);
    
                //Drew: these console logs make it easy to check that data is reaching this point and being applied to the object without error.
                //Drew: console.logs(finishedCities[i].name);
                //Drew: console.log(finishedCities[i].temp);
                //Drew: console.logs(finishedCities[i].tempstatus);
        }
    }
// Get user input for desired weather


// Get user input for days of the year


// Find a place that matches the desired weather

//^will need to check user input vs results from weatherEval function

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