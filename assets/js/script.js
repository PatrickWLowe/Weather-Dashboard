var APIkey = '50cb9da506a2a9a5c0d8fdc9ba554b2d';
var searchresult = document.querySelector('#cityname');
var Inputcity = document.querySelector('#desired-city');
var searchedcity;
var weather = [];
var listedcities = [];

function ShowWeather(weather) {
    $(`#cityname`).text(searchedcity);
    for (var i = 0; i <= 5; i++) {
        $(`#date`+i).html(weather[i].date);
        $(`#img`+i).html(weather[i].icon);
        $(`#Temp`+i).text(weather[i].temp);
        $(`#humid`+i).text(weather[i].hum);
        $(`#wind`+i).text(weather[i].wind);
        }
}

function CityList(listedcities) {
    var text = "";
    for (var i = 0; i < listedcities.length; i++) { 
        text += `<li class= "btn justify-content-between align-items-center" onclick="RecieveAPI2('`+listedcities[i]+`')">`+listedcities[i]+`</li>`;;
    }
    document.getElementById("citylist").innerHTML = text;
}

function AppendCityList(searchedcity) {
    listedcities.push(searchedcity);
    localStorage.setItem("listedcities", JSON.stringify(listedcities));
    CityList(listedcities);
}

function RecieveAPI(lat, long, searchedcity) {
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${APIkey}`;

    fetch(queryURL)
        .then(function (response) {
            console.log(response);
            if (response.status !== 200) {
                console.log('Error: ' + response.status);
                return;
            }
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var weather = [];
            AppendCityList(searchedcity);
            for (var i = 0; i <= 5; i++) {
                var date = data.daily[i].dt;
                var icon = data.daily[i].weather[0].icon;
                var temp = data.daily[i].temp.day;
                var hum = data.daily[i].humidity;
                var wind = data.daily[i].wind_speed;
                weather.push({date, icon, temp, hum, wind});
            }
            ShowWeather(weather);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function RecieveAPI2(query) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${APIkey}`;

    fetch(queryURL)
        .then(function (response) {
            console.log(response);
            if (response.status !== 200) {
                console.log('Error: ' + response.status);
                return;
            }
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data.city.coord.lat;
            var long = data.city.coord.lon;
            searchedcity = query;
            RecieveAPI(lat, long, searchedcity);
        })
    
}

function ShowCityList() {
    var storedCities = JSON.parse(localStorage.getItem("listedcities"));
    if (storedCities !== null) {
        listedcities = storedCities;
    }
    CityList(listedcities);
}

function Submit(event) {
    event.preventDefault();
    var searchVal = document.querySelector('#search-city').value;
    if (!searchVal) {
      console.error('Need Valid Search Term');
      return;
    }
    RecieveAPI2(searchVal);
  }

Inputcity.addEventListener('submit', Submit);
listedcities = ShowCityList(listedcities);