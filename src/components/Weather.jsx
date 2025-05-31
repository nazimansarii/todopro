import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiDaySunnyOvercast,
} from "react-icons/wi";

function getWeatherIcon(main) {
  switch (main) {
    case "Clear":
      return <WiDaySunny className="text-yellow-400 text-7xl drop-shadow-lg" />;
    case "Clouds":
      return <WiCloud className="text-gray-400 text-7xl drop-shadow-lg" />;
    case "Rain":
      return <WiRain className="text-blue-400 text-7xl drop-shadow-lg" />;
    case "Snow":
      return <WiSnow className="text-blue-200 text-7xl drop-shadow-lg" />;
    case "Thunderstorm":
      return (
        <WiThunderstorm className="text-yellow-600 text-7xl drop-shadow-lg" />
      );
    case "Drizzle":
      return <WiRain className="text-blue-300 text-7xl drop-shadow-lg" />;
    case "Fog":
    case "Mist":
    case "Haze":
      return <WiFog className="text-gray-300 text-7xl drop-shadow-lg" />;
    default:
      return (
        <WiDaySunnyOvercast className="text-yellow-300 text-7xl drop-shadow-lg" />
      );
  }
}

export const Weather = () => {
  const [isDark] = useContext(ThemeContext);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [daily, setDaily] = useState([]);

  const API_KEY = "0c01ac8b8b645d9417fcee51f0edda9a";

  // Fetch weather by city name
  const fetchWeatherByCity = (cityName) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeather(data);
          setError(null);
        } else {
          setError("City not found.");
          setWeather(null);
        }
      })
      .catch(() => {
        setError("Failed to fetch weather.");
        setWeather(null);
      });
  };

  const fetch7DayForecast = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.daily) setDaily(data.daily.slice(0, 7));
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod === 200) {
              setWeather(data);
              setError(null);
              fetch7DayForecast(data.coord.lat, data.coord.lon);
            } else {
              setError("Weather data not found.");
            }
          })
          .catch(() => setError("Failed to fetch weather."));
      },
      () => {
        setError("Location permission denied.");
      }
    );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherByCity(city.trim());
      setSearch(city.trim());
    }
  };

  // Helper for fallback
  const fallbackWeather = {
    name: "Madrid",
    sys: { country: "ES" },
    main: {
      temp: 31,
      feels_like: 30,
      temp_min: 27,
      temp_max: 33,
      humidity: 40,
    },
    wind: { speed: 0.2 },
    weather: [{ main: "Clear", description: "sunny" }],
  };

  // Use real weather if available, else fallback
  const displayWeather = weather || fallbackWeather;

  return (
    <div className={`flex w-full   transition-colors duration-300`}>
      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full mb-6">
          <input
            className={`w-full rounded-lg p-3 outline-none transition ${
              isDark
                ? "bg-[#232323] text-white border border-gray-700 placeholder-gray-400"
                : "bg-white text-gray-800 border border-gray-300 placeholder-gray-500"
            }`}
            placeholder="Search for cities"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-500 font-semibold text-lg mb-4">{error}</div>
        )}

        {/* City Info */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {displayWeather.name}
              {displayWeather.sys?.country
                ? `, ${displayWeather.sys.country}`
                : ""}
            </h1>
            <p className="text-sm text-gray-400">
              Humidity: {displayWeather.main.humidity}%
            </p>
            <div className="text-6xl font-bold mt-2">
              {Math.round(displayWeather.main.temp)}°
            </div>
            <div className="capitalize text-lg mt-1">
              {displayWeather.weather[0].description}
            </div>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon(displayWeather.weather[0].main)}
          </div>
        </div>

        {/* Air Conditions */}
        <div
          className={`${
            isDark ? "bg-[#232323]" : "bg-white"
          } rounded-xl p-4 flex flex-wrap gap-5 items-center shadow`}
        >
          <div>
            <h3 className="text-sm text-gray-400">AIR CONDITIONS</h3>
            <p className="text-sm mt-2">
              🌡️ Real Feel{" "}
              <span className="font-bold">
                {Math.round(displayWeather.main.feels_like)}°
              </span>
            </p>
            <p className="text-sm">
              💧 Humidity{" "}
              <span className="font-bold">{displayWeather.main.humidity}%</span>
            </p>
          </div>
          <div>
            <p className="text-sm mt-5">
              💨 Wind{" "}
              <span className="font-bold">
                {displayWeather.wind.speed} km/h
              </span>
            </p>
            <p className="text-sm">
              ☀️ Min/Max{" "}
              <span className="font-bold">
                {Math.round(displayWeather.main.temp_min)}° /{" "}
                {Math.round(displayWeather.main.temp_max)}°
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
