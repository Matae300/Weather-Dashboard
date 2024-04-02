var container = document.querySelector('.container');
var userForm = document.querySelector('#user-form');
var input = document.querySelector('#search');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var search = input.value.trim();

  if (search) {
    getCity(search);
    input.value = ''; 
  } else {
    alert('Please enter a city');
  }
};

var getCity = function (city) {
  var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=261a6198d0498482aef8738b5425bdc5`;

  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          localStorage.setItem("weatherData", JSON.stringify(data)); 
          displayWeatherForecast(data); 
        }).catch(function (error) {
          console.error('Error parsing JSON:', error);
        });
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      console.error('Fetch Error:', error);
      alert('Unable to connect to API');
    });
};

var displayWeatherForecast = function (data) {
  container.textContent = '';


    var forecastData = data.list.slice(0, 5); 
    forecastData.forEach(function (forecast) {
    var forecastInfo = document.createElement('div');
    forecastInfo.textContent = `Date: ${forecast.dt_txt}, Temperature: ${forecast.main.temp}°C, Description: ${forecast.weather[0].description}`;


    var iconCode = forecast.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    var iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    forecastInfo.appendChild(iconImg);

    container.appendChild(forecastInfo);
  });
};

userForm.addEventListener('submit', formSubmitHandler);
