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
            getForecast(lat, lon, searchTerm);
        });

}

function getForecast(lat, lon, searchTerm) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat + "&lon=" + lon + "&units=imperial&appid=6ccdfe86a41e47db6bb4150f78fc2f74"
        )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            render5DayForecast(response.daily)
            renderCurrentWeather(response.daily[0], searchTerm)
        })

    //EMPTY OUT ALL THE WEATHER DATA ON SCREEN
    //AND REPRINT WITH THE NEW STUFF
}

function renderCurrentWeather(weather, city) {
    console.log(weather)
    var currentWeatherDiv = $("#current-weather-container");
    currentWeatherDiv.empty();
    var headerSpan = $("<span>");
    headerSpan.addClass("card-header")
    headerSpan.attr('id',"city-from-search");
    headerSpan.text(city);

    var iconImg = $("<img>");
    var iconCode = weather.weather[0].icon
    iconImg.attr("src","http://openweathermap.org/img/w/" + iconCode + ".png");
    iconImg.attr("width", "40px");
    headerSpan.append(iconImg);


    currentWeatherDiv.append(headerSpan);

    var dateSpan = $("<span>");               
    dateSpan.text(moment.unix(weather.dt).format('MM/DD/YYYY'));
    currentWeatherDiv.append(dateSpan);

    

    var tempSpan = $("<span>");
    tempSpan.text("Temp: " + weather.temp.day + " F");
    currentWeatherDiv.append(tempSpan);

    var windSpan = $("<span>");
    windSpan.text("Wind: " + weather.wind_speed + " MPH");
    currentWeatherDiv.append(windSpan);

    var uviParentSpan = $("<span>");
    uviParentSpan.text("UV Index: " );
    var uviChildSpan = $("<span>");
    uviChildSpan.text(weather.uvi)
    if(weather.uvi < 3){
        uviChildSpan.css('background-color', 'green');
    }
    if(3 > weather.uvi < 8){
        uviChildSpan.css('background-color', 'yellow');
    }
    if(weather.uvi >= 8){
        uviChildSpan.css('background-color', 'red');
    }
    uviParentSpan.append(uviChildSpan);
    currentWeatherDiv.append(uviParentSpan);
}

function render5DayForecast(days) {
    
    var forecastContainerDiv = $("#forecast-container-div");
    forecastContainerDiv.empty();

    var headerDiv = $("<h2>")
    headerDiv.addClass("card-header")
    headerDiv.attr('id',"5-day-forecast");
    headerDiv.text("5-Day Forecast:");
    forecastContainerDiv.append(headerDiv);

    for(var i=0; i<5; ++i){
        $("#day-"+i).empty();
        
        var dayForecastDiv = $("<div>");
        dayForecastDiv.addClass("forecast-card card col-md-2")
        dayForecastDiv.attr('id',"day-"+i);
        
        var dateSpan = $("<span>");     
        console.log(days[i].dt)           
        dateSpan.text(moment.unix(days[i].dt).format('MM/DD/YYYY'));
        dayForecastDiv.append(dateSpan);

        var iconImg = $("<img>");
        var iconCode = days[i].weather[0].icon
        iconImg.attr("src","http://openweathermap.org/img/w/" + iconCode + ".png");
        iconImg.attr("width", "40px");
        dayForecastDiv.append(iconImg);

        var tempSpan = $("<span>");
        tempSpan.text("Temp: " + days[i].temp.day + " F");
        dayForecastDiv.append(tempSpan);

        var windSpan = $("<span>");
        windSpan.text("Wind: " + days[i].wind_speed + " MPH");
        dayForecastDiv.append(windSpan);

        var humiditySpan = $("<span>");
        humiditySpan.text("Humidity: " + days[i].humidity + "%");
        dayForecastDiv.append(humiditySpan);


        forecastContainerDiv.append(dayForecastDiv)
        //$("#day-"+i).append(dayForecastDiv)
    }
};

function renderHistoryToList(){
    var cities = JSON.parse(localStorage.getItem("cityHistory"));
    var cityListUL = $("#city-list").addClass("city-ul");
    cityListUL.empty();

    for(var i =0; i < cities.length; ++i){
        var city = $("<li>");
        //attach on click method to EACH list item
        city.on( "click", handleHistoryClick )
        var innerText = $("<p>").text(cities[i]).addClass("list-group-item list-group-item-secondary d-flex justify-content-between align-items-center");
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