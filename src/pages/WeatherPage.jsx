import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Weather } from "../components/Weather";

const WeatherPage = () => {
  const [isDark] = useContext(ThemeContext);

  return (
    <section
      className={`w-full h-screen sm:max-h-screen pb-10     ${
        isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
      } `}
    >
      <Weather/>
    </section>
  );
};

export default WeatherPage;
