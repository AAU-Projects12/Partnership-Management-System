import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="w-16 h-16 border-4 border-[#014166] border-t-transparent rounded-full animate-spin"></div>
      <span className="mt-4 text-[#014166] text-lg font-semibold">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
