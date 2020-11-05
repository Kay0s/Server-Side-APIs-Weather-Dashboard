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

  //create queryURL function
  function createQuery(city) {
    let inputCity = city ? city : $("#citySearch").val();
    console.log(inputCity);
    console.log(city);
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
            )})</span><!-- <img class="currentCityIcon" src="icon" /> --></h2>`
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
            $(".forecastCardsContainer").append(
              `
                <div class="forecastCard" id="{'card' + index}">
                  <h3>${moment.unix(day.dt).format("M/DD/YYYY")}</h3>
                  <div>icon</div>
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

  $(".handleCitySearch").on("click", function (event) {
    event.preventDefault();
    createQuery();
    localStorage.setItem("inputCity", JSON.stringify(inputCity));
  });

  function uivClassName(uvi) {
    if (uvi < 4) {
      return "uv-favorable";
    } else if ((uvi) => 4 && uvi <= 10) {
      return "uv-moderate";
    } else if (uvi > 11) {
      return "uv-extreme";
    } else {
      return "uv-undefined";
    }
  }

  function generateHistory() {
    let cityHistory = ["Minneapolis", "Ramsey", "Maple Grove"];
    cityHistory.push();

    $(".searchHistoryContainer").html("");
    for (let cityCounter = 0; cityCounter < cityHistory.length; cityCounter++) {
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
