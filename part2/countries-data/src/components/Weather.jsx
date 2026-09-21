import { useState, useEffect } from "react";
import axios from "axios";
import Error from "./Error";
const apiKey = import.meta.env.VITE_WEATHER_API;

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    if (!city) return;
    axios
      .get(weatherURL)
      .then((response) => setWeather(response.data))
      .catch((error) => {
        setError(error.message);
      });
  }, [city]);

  if (error) return <Error error={error} />;

  const celsiusTemp = weather && Math.round(weather.main.temp - 273);

  return (
    <>
      {weather && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature {celsiusTemp}° celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </>
  );
};

export default Weather;
