// variable declarations 
var container = document.querySelector('.container');
var userForm = document.querySelector('#user-form');
var input = document.querySelector('#search');

//preventing defualt action of form, gets value from input field and stores in search variable
var formSubmitHandler = function (event) {
  event.preventDefault();

  var search = input.value.trim();

//if search variable has value, it calls the get city function, otherwise it says please enter a city
  if (search) {
    getCity(search);
    input.value = '';
  } else {
    alert('Please enter a city');
  }
};

//fetch request for api, calling displayweatherforecast and storehistory functions, also some error handling
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
//functions displays forecast data
var displayWeatherForecast = function (data) {
  //clears container, creates h1 with city name
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

  // loop that iterates over each forecast entry
  forecastData.forEach(function (forecast) {
    var forecastInfo = document.createElement('div');
    forecastInfo.classList.add('forecast-div');

    var forecastDate = new Date(forecast.dt * 1000);
    var localDate = forecastDate.toLocaleDateString();
    var localTime = forecastDate.toLocaleTimeString();

    var tempCelsius = forecast.main.temp - 273.15;
    var windSpeed = forecast.wind.speed; 
    var humidity = forecast.main.humidity; 

  //dynamically creates div in html with forecast information
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

    //displays forecastInfo in container
    container.appendChild(forecastInfo);
  });
};

userForm.addEventListener('submit', formSubmitHandler);

//functoion stores data in local storage
function storeHistory(city) {
  //creates a object containing the city name and 5 forecast days
  var cityData = {
    title: city.city.name,
    forecast: city.list.slice(0, 5),
  };

  var cities = JSON.parse(localStorage.getItem('city')) || [];
  cities.push(cityData);
  localStorage.setItem('city', JSON.stringify(cities));

//calling function
  updateSearchHistory(); 
}
// function updates the search history displayed on the page
function updateSearchHistory() {
  // clears citiesContainer element
  var citiesContainer = document.getElementById('citiesContainer');
  citiesContainer.textContent = ''; 

  // grabs search history from local storage, loops through each city and creates a list
  var cities = JSON.parse(localStorage.getItem('city')) || [];
  cities.forEach(function (city) {
    var cityEl = document.createElement('li');
    cityEl.textContent = city.title;
    cityEl.setAttribute('class', 'searchHistory');
    //appends to citiesContainer
    citiesContainer.appendChild(cityEl);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateSearchHistory(); 
//when search history is clicked, grabs city name, calls getCity functions and displays 
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('searchHistory')) {
      var city = event.target.textContent;
      getCity(city);
    }
  });
});
