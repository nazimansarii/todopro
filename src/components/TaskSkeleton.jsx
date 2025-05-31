import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TaskSkeleton = ({ count = 3 }) => {
  const [isDark] = useContext(ThemeContext);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={` ${isDark ? 'bg-[#313131]' : 'bg-gray-100'} rounded-2xl p-4 shadow-md flex flex-col justify-between animate-pulse   min-h-[120px]`}
        >
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </>
  );
};

export default TaskSkeleton;
