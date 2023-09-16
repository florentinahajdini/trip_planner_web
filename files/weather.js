function updateWeather() {
console.log("updateWeather")
const city = document.getElementById("query").value;

fetch("/weather?city=" + city)
    .then(async response => {
        const test = await response.json() // parse JSON String -> Object
        const data = JSON.parse(test)   // parse JSON String -> Object, usually error, but here needed
        
        let city = document.getElementById("weather_city");
        let day = document.getElementById("weather_day");
        let humidity = document.getElementById("humidity");
        let wind = document.getElementById("wind");
        let temperature = document.getElementById("temperature");
        let pressure = document.getElementById("pressure");

        console.log(data)
        console.log(data["temperature"])

        temperature.innerHTML = "Temperature: " + data["temperature"] + "°C";
        wind.innerHTML = "Wind Speed: " + data["wind"] + "m/s";
        city.innerHTML = data["city"];
        day.innerHTML = data["day"];
        humidity.innerHTML = "Humidity:" + data["humidity"] + "%";
        pressure.innerHTML = "Pressure: " + data["pressure"] + "hPA";
    })
    .catch(error => {
        console.log(error);
    })
};

window.onload = function () {
    document.getElementById("button").addEventListener("click", () => updateWeather());
};