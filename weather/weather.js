const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const ecoute = document.querySelector("input");

let inputVal;
let marker;

async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    const icon = document.querySelector(".weather-box img");
    const temperature = document.querySelector(".weather-box .temperature");
    const condition = document.querySelector(".weather-box .description");
    const humidity = document.querySelector(".weather-details .humidity span");
    const vent = document.querySelector(".weather-details .wind span");
    const { current_condition, city_info } = json;

    icon.src = `${current_condition.icon}`;
    icon.innerHTML = `${icon.src}`;
    //icon.innerHTML = `${current_condition.icon}`;
    temperature.innerHTML = `${current_condition.tmp}<span>°C</span>`;
    condition.innerHTML = `${city_info.name}, ${city_info.country}`;
    humidity.innerHTML = `${current_condition.humidity}%`;
    vent.innerHTML = `${current_condition.wnd_spd}Km/h`;

    weatherBox.style.display = "";
    weatherDetails.style.display = "";
    weatherBox.classList.add("fadeIn");
    weatherDetails.classList.add("fadeIn");
    container.style.height = "600px";
  } catch (error) {
    console.error("Erreur lors de la récupération des données : " + error);
    //document.getElementById("meteo").textContent = "errr";
  }
}

ecoute.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    if (ecoute.value.length) {
      const url = `https://www.prevision-meteo.ch/services/json/${ecoute.valu}`;
      fetchWeatherData(url);
    }
  }
});

///////////////////////////// display input

search.addEventListener("click", function () {
  inputVal = document.querySelector("input").value;
  const url = `https://www.prevision-meteo.ch/services/json/${inputVal}`;
  fetchWeatherData(url);
});

///////////////////////////////maping
let map = L.map("mapid").setView([44.833328, -0.56667], 13);
map.on("click", async function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  if (marker != null) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lng]).addTo(map);

  console.log(`Latitude : ${lat}, Longitude : ${lng}`);
  const city_name = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const json = await city_name.json();
  inputVal = json.address.city;
  if (inputVal === undefined) {
    inputVal = json.address.municipality;
  }
  const url = `https://www.prevision-meteo.ch/services/json/${inputVal}`;
  fetchWeatherData(url);
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
