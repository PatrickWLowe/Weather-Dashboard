var APIkey = "50cb9da506a2a9a5c0d8fdc9ba554b2d";
var searchresult = document.querySelector("#cityname");
var Inputcity = document.querySelector("#desired-city");
var searchedcity;
var weather = [];
var listedcities = [];

function ShowWeather(weather) {
  $(`#cityname`).text(searchedcity);
  $(`#date-today`).html(weather[0].date);
  $(`#img-today`).attr("src", weather[0].icon);
  $(`#Temp-today`).text(weather[0].temp);
  $(`#humid-today`).text(weather[0].hum);
  $(`#wind-today`).text(weather[0].wind);
  for (var i = 0; i <= 4; i++) {
    $(`#date` + i).html(weather[i].date);
    $(`#img` + i).attr("src", weather[i].icon);
    $(`#Temp` + i).text(weather[i].temp);
    $(`#humid` + i).text(weather[i].hum);
    $(`#wind` + i).text(weather[i].wind);
  }
}


function CityList(listedcities) {
  var text = "";
  for (var i = 0; i < listedcities.length; i++) {
    text +=
      `<li class= "btn border border-dark justify-content-between align-items-center" onclick="RecieveAPI2('` +
      listedcities[i] +
      `')">` +
      listedcities[i] +
      `</li>`;
  }
  document.getElementById("citylist").innerHTML = text;
}

function AppendCityList(searchedcity) {
  listedcities.push(searchedcity);
  localStorage.setItem("listedcities", JSON.stringify(listedcities));
  CityList(listedcities);
}

function RecieveAPI(lat, long, searchedcity) {
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${APIkey}`;
  
  fetch(queryURL)
    .then(function (response) {
      console.log(response);
      if (response.status !== 200) {
        console.log("Error: " + response.status);
        return;
      }
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var weather = [];
      AppendCityList(searchedcity);
      for (var i = 0; i <= 4; i++) {
        let n = i*8
        var Cday = {
          date: data.list[n].dt,
          icon: data.list[n].weather[0].icon,
          temp: data.list[n].main.temp+` °F`,
          hum: data.list[n].main.humidity+`%`,
          wind: data.list[n].wind.speed+` MPH`,
          icon:`https://openweathermap.org/img/wn/`+data.list[i].weather[0].icon+`.png`
        };
        
        Cday.date = Cday.date * 1000;
        const dateObject = new Date(Cday.date);
        Cday.date = dateObject.toLocaleDateString();
        weather.push(Cday);
      }
      ShowWeather(weather);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function RecieveAPI2(query) {
  var queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIkey}`;
 

  fetch(queryURL)
    .then(function (response) {
      console.log(response);
      if (response.status !== 200) {
        console.log("Error: " + response.status);
        return;
      }
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data[0].lat;
      var long = data[0].lon;
      searchedcity = query;
      RecieveAPI(lat, long, searchedcity);
    });
}

function ShowCityList(listedcities) {
  listedcities = JSON.parse(localStorage.getItem("listedcities"));
  if (listedcities !== null) {
    console.log("No information stored");
    listedcities = [];
  }
  return listedcities;
}

function Submit(event) {
  event.preventDefault();
  var searchVal = document.querySelector("#search-city").value;
  if (!searchVal) {
    console.error("Need Valid Search Term");
    return;
  }
  RecieveAPI2(searchVal);
}

Inputcity.addEventListener("submit", Submit);
listedcities = ShowCityList(listedcities);
