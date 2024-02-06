var resultsEl = document.querySelector(".results");
var submitButtonEl = document.querySelector(".hey");
var dropDownEl = document.querySelector("#weatherDropdown")
var starDateEl = document.querySelector("#startDate");
var endDateEl = document.querySelector("#endDate");
var cardAreaEl = document.querySelector('.card-column');
var favHistoryBtnEl = document.querySelector('.favorites');
var favHistoryEl = document.getElementById('favorites-modal');
var favHistoryContentEl = document.querySelector('.modal-fav-results');
var closeFavHistoryBtnEl = document.querySelector('.close-favorites');
var favBtnEl;
var savedFavorites = [];
//Drew: array for randomly generated city numbers
var cityCodes = [];
//Drew: array of city names from api using the randomly generated city numbers
var selectedCities = [];
//Drew: array of objects that CURRENTLY include city name, temp, and tempstatus(hot,cold,warm,etc)
var finishedCities = [];
//matchCities is the final variable of data that matches user input
var matchedCities = [];
//Drew: global variable for the user selected temperature
var userTemp = "";
var startDate = "";
var endDate = "";
var tempWeather = [];

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
                                //.map function is used to make each value an array within an object so it can be averaged later
                                humidity: weather.days.map(function(day) {
                                        return day.humidity;
                                }),
                                rainChance: weather.days.map(function(day) {
                                        return day.precipprob;
                                }),
                                descrip: weather.days[0].description,
                                temp: weather.days.map(function(day) {
                                        return day.temp;
                                })
                        };
                        //Drew: pushes the object into the tempWeather array
                        tempWeather.push(weatherObj);
                })
                .catch(function(error) {
                        //Drew: logs the error message
                        console.error(error);
                });
});

//Drew: After all the fetches are done, it takes all the promises and pushes them to weatherEval.
Promise.all(fetchPromises)
        .then(function() {
                weatherAvg(tempWeather);
        })
        .catch(function(error) {
                console.error(error);
        });
}
//Drew: function to average the weather data
function weatherAvg(tempWeather){

        for(i = 0; i < tempWeather.length; i++){
                //Drew: temp variable to hold the sum of all the temps
                var temp = 0;
                var humidity = 0;
                var rainChance = 0;

                //Drew: loop that adds all each days weather variable together
                for(j = 0; j < tempWeather[i].temp.length; j++){
                        temp += tempWeather[i].temp[j];
                        humidity += tempWeather[i].humidity[j];
                        rainChance += tempWeather[i].rainChance[j];
                }
                //Drew: divides the sum of the weather variables by the number of days to get the average and math round to get a whole number.
                tempWeather[i].temp = Math.round(temp / tempWeather[i].temp.length);
                tempWeather[i].humidity = Math.round(humidity / tempWeather[i].humidity.length);
                tempWeather[i].rainChance = Math.round(rainChance / tempWeather[i].rainChance.length);
        }
        weatherEval(tempWeather);
}


//Drew: function that checks the temp and assigns a status to it. Also puts the information into an object and then into an array.
function weatherEval(tempWeather) {
        //Drew: array of objects
        finishedCities = [];
    
        for (var i = 0; i < tempWeather.length; i++) {
                //Drew: individiual object


                //Drew: checks the temp and assigns a status to it
                if (tempWeather[i].temp < 75 && tempWeather[i].temp >= 55) {
                        tempWeather[i].tempstatus = "mild";
                } else if (tempWeather[i].temp >= 75) {
                        tempWeather[i].tempstatus = "hot";
                } else if (tempWeather[i].temp < 55 && tempWeather[i].temp >= 32) {
                        tempWeather[i].tempstatus = "cold";
                } else {
                        tempWeather[i].tempstatus = "arctic";
                }
                //Drew: pushes the object into the array
                finishedCities.push(tempWeather[i]);
        }
        matchPlace();
    }

// Get user input for desired weather + date range
var submitHandler = function(event){
        event.preventDefault();
        cityCodes.splice(0, cityCodes.length);
        selectedCities.splice(0, selectedCities.length);
        finishedCities.splice(0, finishedCities.length);
        matchedCities.splice(0, matchedCities.length);
        cardAreaEl.innerHTML = "";
        //Drew: userTemp is the value of the selected option in the dropdown
        userTemp = dropDownEl.value; 

        //removes the Mon,Tues,etc from the date and splits it by spaces to rearrange for the api seach
        var tempStart = starDateEl.value.slice(4).split(" ");
        var tempEnd = endDateEl.value.slice(4).split(" ");

        //variables that use javascripts date function
        var start = new Date(starDateEl.value);
        var end = new Date(endDateEl.value);

        //this gets the difference in days by milliseconds. Then you divide them by 1000 to get seconds, then 60 to get minutes, then 60 to get hours, then 24 to get days. Had to look this function up.
        var daysDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        

        if(starDateEl.value && endDateEl.value) {
                //if the date range is beyond 14 days it wont let you search
                if (daysDifference > 14) {
                                alert("Please enter a date range within 14 days");
                                return;
                        
                } else {
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
                        
                                
                        //formats the date to YYY-MM-DD. Since we use historical data, we need to use 2023 as the year.
                        //tempstart[x]: 2 = year YYYY, 0 = month MM, 1 = day DD
                                if(tempStart[2] === "2024"){
                                        startDate = "2023" + "-" + months[tempStart[0]] + "-" + tempStart[1];
                                } else {
                                        startDate = tempStart[2] + "-" + months[tempStart[0]] + "-" + tempStart[1];
                                }
                                
                                if(tempEnd[2] === "2024"){
                                        endDate = "2023" + "-" + months[tempEnd[0]] + "-" + tempEnd[1];
                                } else {
                                        endDate = tempEnd[2] + "-" + months[tempEnd[0]] + "-" + tempEnd[1];
                                }
                                
                        }
                getRandomCities();
        } else {
        //in case you hit the button without putting anything in. Nothing will run without dates.
        alert("Please enter a date range");
        return;
        }
}

// Find a place that matches the desired weather

function matchPlace() {
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

// Display the search results on page
function printSearchResults(resultObj){
        var topLineResultEl = document.createElement('div');
        //check for if no results are found and print message
        if(resultObj.length === 0){
                //alert("No results found, please try again");
                topLineResultEl.innerHTML = 'No results found, please try again'; 
                topLineResultEl.classList.add('column', 'is-full');
                cardAreaEl.append(topLineResultEl);

        } else {
                var topLineResultEl = document.createElement('div');
                topLineResultEl.innerHTML = 'Showing results for ' + startDate + ' to ' + endDate; 
                topLineResultEl.classList.add('column', 'is-full');
                cardAreaEl.append(topLineResultEl);
                for (var i = 0; i < resultObj.length; i++) {
                        var cardColumnEl = document.createElement('div');
                        cardColumnEl.classList.add('column', 'is-one-third');
                        var resultCardEl = document.createElement('div');
                        resultCardEl.classList.add('card');
                        var resultCardHeaderEl = document.createElement('div');
                        resultCardHeaderEl.classList.add('card-header');
                        resultCardHeaderEl.innerHTML = '<h5 class="title is-5">' + resultObj[i].name + '</h5>';
                        resultCardEl.append(resultCardHeaderEl);
                        var resultCardContentEl = document.createElement('div');
                        resultCardContentEl.classList.add('card-content');
                        resultCardContentEl.innerHTML = "<b>Temperature:</b> " + resultObj[i].temp + '&#176;F </br><b>Humidity:</b> ' + resultObj[i].humidity + '% </br><b>Chance of Rain:</b> ' + resultObj[i].rainChance + '% </br><b>Weather Description:</b> ' + resultObj[i].descrip;
                        var cardFooterEl = document.createElement('footer');
                        cardFooterEl.classList.add('card-footer');
                        favBtnEl = document.createElement('button');
                        favBtnEl.classList.add('button', 'is-success', 'fav-button');
                        favBtnEl.setAttribute('city-name', resultObj[i].name);
                        favBtnEl.setAttribute('alt', 'Add city to favorites');
                        favBtnEl.innerHTML = '<i class="fa-solid fa-star"></i>';
                        cardFooterEl.append(favBtnEl);
                        resultCardContentEl.append(cardFooterEl);
                        resultCardEl.append(resultCardContentEl);
                        cardColumnEl.append(resultCardEl);
                        cardAreaEl.append(cardColumnEl);
              
                        favBtnEl.addEventListener('click', saveSearchResult);


        }  
}
}

//Read stored favorites
function readStoredFavorites() {
    var favorites = localStorage.getItem('savedPlaces');
    if (favorites) {
        favorites = JSON.parse(favorites);
    } else {
        favorites = [];
    }
    return favorites
}

// Save favorited item to local storage
 function saveSearchResult(event) {
    var location = {
    city: this.getAttribute('city-name'),
    startDate: startDate,
    endDate: endDate
  };
  var favoritedResults = readStoredFavorites();
  favoritedResults.push(location);
  localStorage.setItem('savedPlaces', JSON.stringify(favoritedResults));
 }


//Get favorited items from local storage and display in modal
function openSavedFavorites() {
    favHistoryEl.classList.add('is-active')
    printFavorites();
}

function closeSavedFavorites() {
        favHistoryContentEl.innerHTML = "";
    favHistoryEl.classList.remove('is-active');
    }

//Print data in modal

function printFavorites(){
        var savedPlaces = localStorage.getItem('savedPlaces');
        var favorites = JSON.parse(savedPlaces);
    if (favorites) {
        for (i = 0; i < favorites.length; i++){
            var savedResult = document.createElement('div');
            savedResult.setAttribute('id', 'saved-results');
            savedResult.innerHTML = '<b>' + favorites[i].city + '</b>: ' + favorites[i].startDate + ' to ' + favorites[i].endDate ;
            favHistoryContentEl.append(savedResult);
        }
    }

}

submitButtonEl.addEventListener('click', submitHandler);
favHistoryBtnEl.addEventListener('click', openSavedFavorites);
closeFavHistoryBtnEl.addEventListener('click', closeSavedFavorites);