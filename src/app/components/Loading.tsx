import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        {/* Message */}
        <h2 className="text-gray-700 text-lg font-medium">{message}</h2>
      </div>
    </div>
  );
};

export default Loading;