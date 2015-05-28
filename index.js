(function() {
    
var API_WEATHER_KEY = "665c985d606f48ca2ece77e4ede3c542";
var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID =" + API_WEATHER_KEY + "&";
var IMG_WEATHER = "http://openweathermap.org/img/w/"; 

var API_WORLDTIME_KEY = "d1e9e6093753a126f0a125cfc5edf";
var API_WORLDTIME = "http://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";

var today = new Date();
var timeNow = today.toLocaleTimeString();

//Para evitar busquedas constantes en el DOM
var $body = $("body");
var $loader = $(".loader");

var nombreNuevaCiudad = $("[data-input='cityAdd']");
var buttonAdd = $("[data-button='add']");
var buttonLoad = $("[data-saved-cities]");

var cities = [];
var cityWeather = {};
 cityWeather.zone;   
 cityWeather.icon;
 cityWeather.temp;
 cityWeather.temp_max;
 cityWeather.temp_min;
 cityWeather.main;
 
 $(buttonAdd).on("click", addNewCity);
 $(nombreNuevaCiudad).on("keypress", function(event) {
     //console.log(event.which);
     if(event.which ==13){
         addNewCity(event);
     }
 });
  
 $(buttonLoad).on("click", loadSavedCities); 
  
if(navigator.geolocation){
 navigator.geolocation.getCurrentPosition(getCoords, errorFound);
 
} else{
    alert("Actualiza tu Navegador");
}
    



function errorFound(error){
    alert("Un Error ocurrio: " + error.code);
    // 0: Error desconocido
    // 1: Permiso denegado
    // 2: Posicion no esta disponible
    // 3: Timeout
};

function getCoords(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Tu posicion es: " + lat + "," + lon);
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
};

function getCurrentWeather(data){
   cityWeather.zone = data.name;   
   cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
   cityWeather.temp = data.main.temp - 273.15;
   cityWeather.temp_max = data.main.temp_max - 273.15;
   cityWeather.temp_min = data.main.temp_min - 273.15;
   cityWeather.main = data.weather[0].main;
   //console.log(cityWeather.icon);
   renderTemplate(cityWeather);
};

function activateTemplate(id){
  var t = document.querySelector(id);
  return document.importNode(t.content, true);
};

function renderTemplate(cityWeather, localtime) {
    // # porque es un ID
    // . si fuera una clase
    //   sin nada si fuera un elemento
  var clone = activateTemplate("#template--city");
  var timeToShow;
  
  if(localtime) {
    timeToShow = localtime.split(" ")[1];    
  }
  else {
    timeToShow = timeNow;
  }
  
clone.querySelector("[data-time]").innerHTML = timeToShow;
clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
clone.querySelector("[data-icon]").src = cityWeather.icon;
clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

//$(".loader").hide();
//$("body").append(clone);
$($loader).hide(clone);
$($body).append(clone);
};


function addNewCity(event){
  // Quita la  funcionalidad de tipo submit al boton
     event.preventDefault(); 
    
 $.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity );
     
};

function getWeatherNewCity(data) {
  //console.log(data); 
  $.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function(response) {
   
    $(nombreNuevaCiudad).val("");
   
   cityWeather = {};
   cityWeather.zone = data.name;   
   cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
   cityWeather.temp = data.main.temp - 273.15;
   cityWeather.temp_max = data.main.temp_max - 273.15;
   cityWeather.temp_min = data.main.temp_min - 273.15;
   cityWeather.main = data.weather[0].main;
     
   //console.log(response);
   renderTemplate(cityWeather, response.data.time_zone[0].localtime); 
   
   cities.push(cityWeather);
   localStorage.setItem("cities", JSON.stringify(cities));
  });
};

function loadSavedCities(event) {
  event.preventDefault();
  
  function renderCities(cities) {
      cities.forEach(function(city){
          renderTemplate(city);
      });
  };
  
  var cities = JSON.parse(localStorage.getItem("cities"));
  renderCities(cities);
};


})();