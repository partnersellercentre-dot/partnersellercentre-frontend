import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-green-700 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
