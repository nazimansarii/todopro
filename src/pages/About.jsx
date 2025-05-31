import React, { useContext } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const About = () => {
  const [isDark] = useContext(ThemeContext);

  return (
    <div
      className={`${
        isDark ? "bg-[#1B1B1B] text-white" : ""
      } text-gray-800 p-8  w-full min-h-screen`}
    >
      <header className="text-center mb-2 md:mb-3">
        <FaChevronLeft
          className="text-gray-400 text-xl  cursor-pointer"
          onClick={() => history.back()}
        />
        <h1 className="text-xl md:text-5xl font-extrabold ">About Us</h1>
      </header>
      <main className="space-y-2 md:space-y-4 max-w-4xl mx-auto">
        <p className="text-lg leading-relaxed">
          Welcome to our task management application! Our goal is to help you
          stay organized and productive in your daily life.
        </p>
        <p className="text-lg leading-relaxed">
          With features like task prioritization, reminders, and progress
          tracking, we aim to simplify your workflow and help you achieve your
          goals efficiently.
        </p>
        <p className="text-lg leading-relaxed">
          Our team is passionate about creating tools that empower individuals
          and teams to reach their full potential. We are committed to
          delivering innovative solutions that make your life easier.
        </p>
        <p className="text-lg leading-relaxed">
          At the heart of our mission is a belief in simplicity, innovation, and
          user-centric design. We strive to provide an intuitive and seamless
          experience for all our users.
        </p>
      </main>
      <footer className="mt-8 text-center border-t border-gray-300 pt-6">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TodoPro. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;
