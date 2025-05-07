import React from "react";
import "../styles/HomeSection2.css";

const CTAButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="cta-button">
      {text}
    </button>
  );
};

export default CTAButton;
