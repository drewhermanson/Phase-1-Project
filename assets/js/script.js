var resultsEl = document.querySelector(".results");
var submitButtonEl = document.querySelector(".hey");
var dropDownEl = document.querySelector("#weatherDropdown")
var starDateEl = document.querySelector("#startDate");
var endDateEl = document.querySelector("#endDate");
var favHistoryBtnEl;
var favHistoryEl;
var savedFavorites = [];
//Drew: array for randomly generated city numbers
var cityCodes = [];
//Drew: array of city names from api using the randomly generated city numbers
var selectedCities = [];
//Drew: array of objects that CURRENTLY include city name, temp, and tempstatus(hot,cold,warm,etc)
var finishedCities = [];
//Drew: global variable for the user selected temperature
var userTemp = "";
var startDate = "";
var endDate = "";

// Creates array of randomized index numbers
function getRandomCities() {  

        for (var i = 0; i < 10; i++){
    
        var num = Math.floor(Math.random() * 4503);
        cityCodes.push(num);
        }
        getCityNames();
}

// Fetches data based on user input
//Drew: function to get city names from api using the randomly generated city numbers
function getCityNames() {

        var cityApi = "https://countriesnow.space/api/v0.1/countries/population/cities";
    
        //Drew: fetch statement that first sends us 4503 cities
        fetch(cityApi).then(function (response) {
                if (response.ok) {
                        response.json().then(function (cities) {
                                for (var i = 0; i < 3; i++) {
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
        var fetchPromises = selectedCities.map(function(city, i) {
                //Drew: will need to code user stated date ranges
                var weatherApi = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "/" + startDate + "/" + endDate + "?unitGroup=us&include=days&key=GQ2YDMGMHEHD89M9KEGLM5ZEW&contentType=json";

                //Drew: individual fetch for weather data
                return fetch(weatherApi)
                        .then(function(response) {
                                //Drew: checks for a positive response
                                if (response.ok) {
                                        return response.json();
                                } else {
                                        //Drew: returns a rejected promise with the error message
                                        return Promise.reject(new Error("Error fetching weather data for " + city));
                                }
                        })
                        .then(function(weather) {
                                //Drew: adds the cities weather data to the tempWeather array
                                var weatherObj = {
                                        name: selectedCities[i],
                                        tempstatus: "",
                                        humidity: weather.days[0].humidity,
                                        rainChance: weather.days[0].precipprob,
                                        descrip: weather.days[0].description,
                                        temp: weather.days.map(function(day) {
                                                return day.temp;
                                        }),
                                };
                                tempWeather.push(weatherObj);
                        })
                        .catch(function(error) {
                                //Drew: logs the error message
                                console.error(error);
                        });
        });

        //Drew:  After all the fetches are done, it takes all the promises and pushes them to weatherEval.
        Promise.all(fetchPromises)
                .then(function() {
                        console.log(tempWeather);
                        weatherEval(tempWeather);
                })
                .catch(function(error) {
                        console.error(error);
                });
        }

// Function to find a place that matches the desired weather
//Drew: function that checks the temp and assigns a status to it. Also puts the information into an object and then into an array.
function weatherEval(tempWeather) {
        //Drew: array of objects
        finishedCities = [];
    
        for (var i = 0; i < tempWeather.length; i++) {
                //Drew: individiual object


                //Drew: checks the temp and assigns a status to it
                if (tempWeather[i].temp[0] < 75 && tempWeather[i].temp[0] >= 55) {
                        tempWeather[i].tempstatus = "mild";
                } else if (tempWeather[i].temp[0] >= 75) {
                        tempWeather[i].tempstatus = "hot";
                } else if (tempWeather[i].temp[0] < 55 && tempWeather[i].temp[0] >= 32) {
                        tempWeather[i].tempstatus = "cold";
                } else {
                        tempWeather[i].tempstatus = "arctic";
                }
                //Drew: pushes the object into the array
                finishedCities.push(tempWeather[i]);
    
                //Drew: these console logs make it easy to check that data is reaching this point and being applied to the object without error.
                //Drew: console.logs(finishedCities[i].name);
                //Drew: console.log(finishedCities[i].temp);
                //Drew: console.logs(finishedCities[i].tempstatus);
        }
        matchPlace();
    }

// Get user input for desired weather + date range
var submitHandler = function (event) {
        event.preventDefault();
        cityCodes.splice(0, cityCodes.length);
        //Drew: userTemp is the value of the selected option in the dropdown
        userTemp = dropDownEl.value; 



        if(starDateEl.value || endDateEl.value) {
        //Drew: Object to format the user inputted date
        var months = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12"
                };
        //Drew:variable to format the user inputted date. Cuts off the day and then splits its apart by spaces.
        var tempStart = starDateEl.value.slice(4).split(" ");

        //formats the date to YYY-MM-DD. Since we use historical data, we need to use 2023 as the year.
        if(tempStart[2] === "2024"){
                startDate = "2023" + "-" + months[tempStart[0]] + "-" + tempStart[1];
        } else {
                startDate = tempStart[2] + "-" + months[tempStart[0]] + "-" + tempStart[1];
        }
        var tempEnd = endDateEl.value.slice(4).split(" ");
        if(tempEnd[2] === "2024"){
                endDate = "2023" + "-" + months[tempEnd[0]] + "-" + tempEnd[1];
        } else {
                endDate = tempEnd[2] + "-" + months[tempEnd[0]] + "-" + tempEnd[1];
        }
        getRandomCities();
        } else {
                alert("Please enter a date range");
                return;
        }
};


// Find a place that matches the desired weather

function matchPlace() {
        var matchedCities = [];

        //Drew: for loop to check the random cities temps against the user inputted temp. Puts cities that match into a new array.
        for (var i = 0; i < finishedCities.length; i++) {
                if (finishedCities[i].tempstatus === userTemp) {
                        matchedCities.push(finishedCities[i]);
                }
        }
        //Need to remove the _'s that were added for the api search and replace them with spaces so they can be displayed.
        for (var i = 0; i < matchedCities.length; i++) {
                matchedCities[i].name = matchedCities[i].name.replace(/_/g, " ");
        }

        printSearchResults(matchedCities);
}

//^will need to check user input vs results from weatherEval function

// Display the search results on page

function printSearchResults(resultObj){
        console.log(resultObj);
        //resultObj.name .temp .tempstatus

        //check for if no results are found and then rerun the search if nothing is found. This will loop infinitely if no results are found.
       
       

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
                        resultCardContentEl.innerHTML = "Temperature: " + resultObj[i].temp;
                        //Add actual values for weather
                        //resultCardContentEl.innerHTML = 'High temp: ' + resultObj[i].high_temp + '</br> Humidity: ' + resultObj[i].humidity;
                        var favBtnEl = document.createElement('button');
                        favBtnEl.classList.add('button', 'is-info');
                        resultCardContentEl.append(favBtnEl);
                        resultCardEl.append(resultCardContentEl);

                        resultsEl.append(resultCardEl);

                        //we should make a button appear after the user has searched with some text saying "need more results"
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

submitButtonEl.addEventListener('click', submitHandler);