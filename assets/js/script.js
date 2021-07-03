var form = document.getElementById("user-form");
form.addEventListener("submit", myFunction);

function myFunction(event) {
    event.preventDefault();
    //create a variable to hold the search input
    var searchTerm = document.getElementById("searchTerm").value;
    getGeoLocation(searchTerm)
    addCityToStorage (searchTerm)
}

function addCityToStorage(city) {
    //first check what cities have already been stored by user
    var cities = JSON.parse(localStorage.getItem("cityHistory"));
    var cityLocation = cities.indexOf(city)

    if(cityLocation === -1){
        cities.push(city);
        localStorage.setItem("cityHistory", JSON.stringify(cities));
        renderHistoryToList();

    }

}
function getGeoLocation(searchTerm) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?limit=1&q=" +
            searchTerm + "&appid=6ccdfe86a41e47db6bb4150f78fc2f74"
        )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var lat = response[0].lat;
            var lon = response[0].lon;
            getForecast(lat, lon);
        });

}

function getForecast(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat + "&lon=" + lon + "&units=imperial&appid=6ccdfe86a41e47db6bb4150f78fc2f74"
        )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            render5DayForecast(response.daily)
        })

    //EMPTY OUT ALL THE WEATHER DATA ON SCREEN
    //AND REPRINT WITH THE NEW STUFF
}

function render5DayForecast(days) {
    console.log(days)
    for(var i=0; i<5; ++i){
        $("#day-"+i).empty();

        var dayForecastDiv = $("<div>");
        var dayForecastUL = $("<ul>");

        var tempLI = $("<li>");
        tempLI.text(days[i].temp.day);
        dayForecastUL.append(tempLI);

        var windLI = $("<li>");
        windLI.text(days[i].wind_speed);
        dayForecastUL.append(windLI);

        var humidityLI = $("<li>");
        humidityLI.text(days[i].humidity);
        dayForecastUL.append(humidityLI);

        dayForecastDiv.append(dayForecastUL)
        $("#day-"+i).append(dayForecastDiv)
    }
};

function renderHistoryToList(){
    var cities = JSON.parse(localStorage.getItem("cityHistory"));
    var cityListUL = $("#city-list");
    cityListUL.empty();

    for(var i =0; i < cities.length; ++i){
        var city = $("<li>");
        //attach on click method to EACH list item
        city.on( "click", handleHistoryClick )
        var innerText = $("<p>").text(cities[i]);
        city.append(innerText);
    

        cityListUL.append(city);
    }
}

function handleHistoryClick(event) {
    //the EVENT object will show me WHO clicked in the list
    //could be cleveland, rocky river, etc.
    var cityClicked = event.target.innerHTML
    getGeoLocation(cityClicked)
}

renderHistoryToList();