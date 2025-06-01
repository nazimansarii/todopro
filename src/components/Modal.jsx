import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ type, message, isOpen }) => {
  // Choose color and icon based on type
  let bgColor = "bg-amber-300";
  let icon = null;
  let prefix = "";

  switch (type) {
    case "task":
      bgColor = "bg-green-500";
      icon = "📝";
      prefix = "Task: ";
      break;
    case "note":
      bgColor = "bg-blue-500";
      icon = "📝";
      prefix = "Note: ";
      break;
    case "delete":
      bgColor = "bg-red-600";
      icon = "🗑️";
      prefix = "Deleted: ";
      break;
    case "logout":
      bgColor = "bg-gray-700";
      icon = "🚪";
      prefix = "Logged out: ";
      break;
    case "account":
      bgColor = "bg-purple-600";
      icon = "👤";
      prefix = "Account: ";
      break;
    default:
      bgColor = "bg-amber-300";
      icon = "ℹ️";
      prefix = "";
  }

  return createPortal(
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed top-5 mx-3 sm:right-5 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-base font-semibold transition-all duration-300 ${bgColor}`}
    >
      <span className="mr-2">{icon}</span>
      <span className="font-bold">{prefix}</span>
      {message}
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
