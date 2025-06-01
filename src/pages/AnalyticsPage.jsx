import React, { useContext } from "react";
import Analytics from "../components/Analytics";
import { ThemeContext } from "../context/ThemeContext";

const AnalyticsPage = () => {
  const [isDark] = useContext(ThemeContext);
  return (
    <section
      className={`w-full h-fit sm:h-screen sm:overflow-auto custom-scrollbar ${
        isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
      } `}
    >
      <Analytics />
    </section>
  );
};

export default AnalyticsPage;
