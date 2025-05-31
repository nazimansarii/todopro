import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ type, message, isOpen }) => {
  // Choose color based on type
  const bgColor =
    type === "task"
      ? "bg-green-500"
      : type === "note"
      ? "bg-blue-500"
      : "bg-amber-300";

  return createPortal(
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed top-5 mx-3 sm:right-5 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-base font-semibold transition-all duration-300 ${bgColor}`}
    >
      {type === "task" && <span>📝 Task: </span>}
      {type === "note" && <span>📝 Note: </span>}
      {message}
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
