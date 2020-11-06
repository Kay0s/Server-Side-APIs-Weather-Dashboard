// weather dashboard with form inputs
//create search box
//display current and future conditions for queried city
//and that city is added to the search history
//on city search present city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//present color coding for uv index indicating whether the conditions are favorable, moderate or severe
// display 5-day forecast of queried city that indicates the date, an icon representation of weather conditions future weather conditions, the temperature, and the humidity for the queried city
// clickable view of search history, that when clicked, shows the current and future conditions for that city again
// when the weather dashboard is opened, the last queried city and its forecast is displayed

$(document).ready(function () {
  generateHistory();
  $(".handleCitySearch").on("click", function (event) {
    event.preventDefault();
    console.log("WOO");
    createQuery();
    let inputCity = $("#citySearch").val();

    // get list of cities from local storage
    let cityArray = JSON.parse(localStorage.getItem("inputCity")) || [];

    // add inputCity to list
    cityArray.push(inputCity);

    console.log("Setting?", cityArray);
    // re-save list of cities TO local storage
    localStorage.setItem("inputCity", JSON.stringify(cityArray));
    generateHistory();
  });

  //create queryURL function
  function createQuery(city) {
    let inputCity = city ? city : $("#citySearch").val();
    console.log(
      "Value of inputCity, could be the city history, could be the search input. depends on which you clicked: " +
        inputCity
    );
    console.log("City passed from city history clicked: " + city);
    let query1URL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      inputCity +
      "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";

    $.ajax({
      url: query1URL,
      method: "GET",
    }).then(function (data) {
      console.log("I am current data: ");
      console.log(data);
      let query2URL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";

      $.ajax({
        url: query2URL,
        method: "GET",
      }).then(function (uvExtendedData) {
        console.log("I am uv and extended data: ");
        console.log(uvExtendedData);
        let weatherIcon = uvExtendedData.current.weather[0].icon;
        let iconURL =
          "http://openweathermap.org/img/wn/" + weatherIcon + ".png";
        $(".reportColumn").html("");

        $(".reportColumn").append(
          '<div class="todaysForecastContainer"></div>'
        );

        $(".todaysForecastContainer").append(
          `<h2 class="currentCity">Current City ${
            data.name
          } <span class="currentCityDate">(${moment
            .unix(uvExtendedData?.current?.dt)
            .format(
              "M/DD/YYYY"
            )})</span> <img id="weatherIcon" src="${iconURL}"/></h2>`
        );

        $(".todaysForecastContainer").append(
          `<p class="currentCityTemp">Temperature: ${uvExtendedData.current.temp}</p>`
        );

        $(".todaysForecastContainer").append(
          `<p class="currentCityHumidity">Humidity: ${uvExtendedData.current.humidity}</p>`
        );

        $(".todaysForecastContainer").append(
          `<p class="currentCityWindSpeed">Wind Speed: ${uvExtendedData.current.wind_speed}</p>`
        );

        $(".todaysForecastContainer").append(
          `<p>
          UV Index:
          <span class="${uivClassName(uvExtendedData.current.uvi)}"
            >${uvExtendedData.current.uvi}</span
          >
        </p>`
        );

        $(".reportColumn").append('<div class="multiForecastContainer"></div>');
        $(".multiForecastContainer").append("<h2>5-Day Forecast:</h2>");
        $(".multiForecastContainer").append(
          '<div class="forecastCardsContainer"></div>'
        );
        uvExtendedData?.daily?.map((day, index) => {
          if (index > 0 && index < 6) {
            console.log(day.weather[0].icon);
            $(".forecastCardsContainer").append(
              `
                <div class="forecastCard" id="{'card' + index}">
                  <h3>${moment.unix(day.dt).format("M/DD/YYYY")}</h3>
                  <div><img id="weatherIcon" src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }.png"/></div>
                  <p>Temp: ${day.temp.day}°F</p>
                  <p>Humidity: ${day.humidity}%</p>
                </div>
              `
            );
          }
        });
      });
    });
  }

  function uivClassName(uvi) {
    if (uvi < 4) {
      return "uv-favorable";
    } else if (uvi >= 4 && uvi <= 10) {
      return "uv-moderate";
    } else if (uvi > 11) {
      return "uv-extreme";
    } else {
      return "uv-undefined";
    }
  }

  function generateHistory() {
    //let cityHistory = ["Minneapolis", "Ramsey", "Maple Grove"];
    // get cityHistory from local storage
    let cityHistory = JSON.parse(localStorage.getItem("inputCity"));
    //if search history doesn't exist, then create searched city button
    if (!$(".searchHistoryContainer")?.length && cityHistory?.length) {
      $(".searchColumn").append('<div class="searchHistoryContainer"></div>');
    }

    $(".searchHistoryContainer").html("");
    for (
      let cityCounter = 0;
      cityCounter < cityHistory?.length;
      cityCounter++
    ) {
      let city = cityHistory[cityCounter];
      $(".searchHistoryContainer").append(
        `<button id="CityBtn${cityCounter}">${city}</button>`
      );
      $(".searchHistoryContainer").on(
        "click",
        `#CityBtn${cityCounter}`,
        function () {
          createQuery(city);
          localStorage.setItem("city", JSON.stringify(city));
        }
      );
    }
  }
});
