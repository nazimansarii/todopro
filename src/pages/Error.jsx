import React from 'react';
import { Link } from 'react-router';

export const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">Oops! Page Not Found</p>
      <p className="text-gray-500 mt-2 text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to={"/"}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};
