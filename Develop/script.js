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
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(function (data) {
      displayWeatherForecast(data);
      storeHistory(data);
    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
      alert('City not found. Please try again.');
    });
};

var displayWeatherForecast = function (data) {
  container.textContent = '';
  var cityName = document.createElement('h1');
  cityName.textContent = data.city.name;
  container.appendChild(cityName);

  var uniqueDates = [];
  var forecastData = data.list.filter(function (forecast) {
    var date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (!uniqueDates.includes(date)) {
      uniqueDates.push(date);
      return true;
    }
    return false;
  });

  forecastData.forEach(function (forecast) {
    var forecastInfo = document.createElement('div');
    forecastInfo.classList.add('forecast-div');

    var forecastDate = new Date(forecast.dt * 1000);
    var localDate = forecastDate.toLocaleDateString();
    var localTime = forecastDate.toLocaleTimeString();

    var tempCelsius = forecast.main.temp - 273.15;
    var windSpeed = forecast.wind.speed; 
    var humidity = forecast.main.humidity; 

    forecastInfo.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${localDate}</h5>
      <p class="card-text">Time: ${localTime}</p>
      <p class="card-text">Temperature: ${tempCelsius.toFixed(2)}°C</p>
      <p class="card-text">Description: ${forecast.weather[0].description}</p>
      <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
      <p class="card-text">Humidity: ${humidity}%</p>
    </div>
  `;

    var iconCode = forecast.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    var iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    forecastInfo.appendChild(iconImg);

    container.appendChild(forecastInfo);
  });
};

userForm.addEventListener('submit', formSubmitHandler);

function storeHistory(city) {
  var cityData = {
    title: city.city.name,
    forecast: city.list.slice(0, 5),
  };

  var cities = JSON.parse(localStorage.getItem('city')) || [];
  cities.push(cityData);
  localStorage.setItem('city', JSON.stringify(cities));

  updateSearchHistory(); 
}

function updateSearchHistory() {
  var citiesContainer = document.getElementById('citiesContainer');
  citiesContainer.textContent = ''; 

  var cities = JSON.parse(localStorage.getItem('city')) || [];
  cities.forEach(function (city) {
    var cityEl = document.createElement('li');
    cityEl.textContent = city.title;
    cityEl.setAttribute('class', 'searchHistory');
    citiesContainer.appendChild(cityEl);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateSearchHistory(); 

  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('searchHistory')) {
      var city = event.target.textContent;
      getCity(city);
    }
  });
});
