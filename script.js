// weather dashboard with form inputs
//create search box
//display current and future conditions for queried city
//and that city is added to the search history
//on city search present city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//present color coding for uv index indicating whether the ocnditions are favorable, moderate or severe
// display 5-day forecast of queried city that indicates the date, an icon representation of weather conditions future weather conditions, the temperature, and the humidity for the queried city
// clickable view of search history, that when clicked, shows the current and future conditions for that city again
// when the weather dashboard is opened, the last queried city and its forecast is displayed

//create queryURL function
function createQuery(cityName) {
  let query1URL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=ae091cae15863695a3bd2a2f28f74012";

  $.ajax({
    url: query1URL,
    method: "GET",
  }).then(function (data) {
    console.log("I am whole data: ");
    console.log(data);
    let query2URL =
      "https://api.openweathermap.org/2.5/uvi?lat=" +
      data.coord.lat +
      "&lon=" +
      data.coord.lon +
      "&appid=ae091cae15863695a3bd2a2f28f74012";

    $.ajax({
      url: query2URL,
      method: "GET",
    }).then(function (uvData) {
      console.log("I am uv data: ");
      console.log(uvData);
    });
  });
}

createQuery("los+angeles");
