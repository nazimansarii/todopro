import React, { useContext, useState } from "react";
import { FaChevronLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router";

const faqData = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Go to the Login page and click on <b>Forgot password?</b> Enter your
        registered email address and follow the instructions in the email you
        receive to reset your password.
      </>
    ),
  },
  {
    question: "How can I contact customer support?",
    answer: (
      <>
        You can email us at{" "}
        <Link to="mailto:support@todo.com" className="underline text-cyan-400">
          support@todo.com
        </Link>{" "}
        
      </>
    ),
  },
  {
    question: "Where can I find the user manual?",
    answer: (
      <>
        You can find the user manual and helpful guides in the <b>Help</b>{" "}
        section of the app menu. If you need more details, please contact our
        support team.
      </>
    ),
  },
  {
    question: "Is my data secure?",
    answer: (
      <>
        Yes, your data is securely stored in the cloud and protected with
        industry-standard encryption. Only you have access to your tasks and
        notes.
      </>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <>
        Go to your <b>Account</b> page and click on <b>Delete Account</b>.
        Please note this action is permanent and will remove all your data.
      </>
    ),
  },
];

export const HelpSupport = () => {
  const [isDark] = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div
      className={`w-full h-fit px-3 py-10 sm:py-5 sm:h-screen sm:overflow-auto custom-scrollbar ${
        isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
      } `}
    >
      <FaChevronLeft
        className="text-gray-400 text-xl  cursor-pointer"
        onClick={() => history.back()}
      />

      <h1 className="text-4xl font-bold mb-5 mt-5 text-center">Help & Support</h1>
      <p className="text-lg  mb-8">
        Welcome to the Help & Support page. If you have any questions or need
        assistance, please refer to the resources below or contact us directly.
      </p>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold  mb-4">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-4">
          {faqData.map((faq, idx) => (
            <li key={idx} className="border-b border-gray-700 pb-2">
              <button
                className="flex items-center w-full justify-between text-left font-medium focus:outline-none"
                onClick={() => handleToggle(idx)}
              >
                <span>{faq.question}</span>
                {openIndex === idx ? (
                  <FaChevronUp className="ml-2 text-cyan-400" />
                ) : (
                  <FaChevronDown className="ml-2 text-cyan-400" />
                )}
              </button>
              {openIndex === idx && (
                <div className="text-gray-400 text-base mt-2 ml-2 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold  mb-4">Contact Us</h2>
        <p className=" mb-5">
          <span className="font-medium">Email:</span> support@todo.com
        </p>
       
      </section>
    </div>
  );
};
