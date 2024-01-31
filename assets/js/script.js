//Drew: selector for content container
placeholderEl = document.querySelector("#testing");
//Drew: selector for local storage container
placeholderEl = document.querySelector("#testing");

//Drew: array for randomly generated city numbers
var cityCodes = [];

//Drew: array of city names from api using the randomly generated city numbers
var selectedCities = [];
//Drew: array of objects that CURRENTLY include city name, temp, and tempstatus(hot,cold,warm,etc)
var finishedCities = [];

//Add more places with weather descriptions


//Drew: function that generates 10 random numbers between 0 and 4503 which is the max number of cities in the api
function getRandomCities() {  

    for (var i = 0; i < 10; i++){

    var num = Math.floor(Math.random() * 4503);
    cityCodes.push(num);
    }
}


//Drew: function to get city names from api using the randomly generated city numbers
function getCityNames() {

    var cityApi = "https://Drew: countriesnow.space/api/v0.1/countries/population/cities";

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
            var weatherApi = "https://Drew: api.weatherbit.io/v2.0/history/daily?&city=" + city + "&start_date=2024-01-24&end_date=2024-01-25&Units=I&key=6f251738284f43388d62e002e46361af";

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

//Get user input for desired weather


//Get user input for days of the year


// Find a place that matches the desired weather
//Drew: ^will have to check against the weatherEval function below

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

//Display the selected place
if (selectedPlace !== null) {
    console.log(`Recommended destination for ${desiredWeather} weather on ${desiredDays}: ${selectedPlace}`);
} else {
    console.log("Sorry, we couldn't find a destination matching your preferences.");
}


//Drew: if you want to test the javascript uncomment the two functions below
//Drew: first function invokes the random # generator
//Drew: getRandomCities();
//Drew: second function will start the chain of functions that make api calls
//Drew: getCityNames();