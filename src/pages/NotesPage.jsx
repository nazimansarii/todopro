import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Notes from "../components/Notes";

export const NotesPage = () => {
  const [isDark] = useContext(ThemeContext);

  return (
    <section
      className={`h-screen sm:max-h-screen pb-10  sm:overflow-y-scroll custom-scrollbar  ${
        isDark ? "bg-[#1B1B1B] text-white" : " text-[#1B1B1B]"
      } w-full  sm:flex-row p-0 `}
    >
     
      <Notes />
    </section>
  );
};
