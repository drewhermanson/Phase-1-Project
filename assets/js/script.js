// Define an array of places with their weather conditions
const places = [
    { name: "Beach Paradise", weather: "Hot" },
    { name: "Mountain Retreat", weather: "Mild" },
    { name: "Ski Resort", weather: "Cold" },
    { name: "Tropical Island", weather: "Mild" },
    // Add more places with weather descriptions
];

// Function to find a place that matches the desired weather
function findMatchingPlace(desiredWeather) {
    for (const place of places) {
        if (place.weather.toLowerCase() === desiredWeather.toLowerCase()) {
            return place.name;
        }
    }
    return null; // No matching place found
}

// Get user input for desired weather


// Get user input for days of the year


// Find a place that matches the desired weather


// Display the selected place
if (selectedPlace !== null) {
    console.log(`Recommended destination for ${desiredWeather} weather on ${desiredDays}: ${selectedPlace}`);
} else {
    console.log("Sorry, we couldn't find a destination matching your preferences.");
}
