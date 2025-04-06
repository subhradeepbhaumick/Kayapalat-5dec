"use client"

import React from "react";
import {
  FaCouch,
  FaUtensils,
  FaBed,
  FaSink,
  FaChild,
  FaBath,
  FaEllipsisH,
  FaLightbulb,
  FaPlus,
  FaPlusCircle,
} from "react-icons/fa";
import "../../helpers/css/RippleEffect.css";



const sections = [
  { icon: <FaCouch />, label: "Living Room", href: "/gallery#living-room" },
  { icon: <FaUtensils />, label: "Dining", href: "/gallery#dining" },
  { icon: <FaBed />, label: "Bedroom", href: "/gallery#bedroom" },
  { icon: <FaSink />, label: "Kitchen", href: "/gallery#kitchen" },
  { icon: <FaLightbulb />, label: "False Ceiling", href: "/gallery#false-ceiling" },
  { icon: <FaChild />, label: "Kids Room", href: "/gallery#kids-room" },
  { icon: <FaBath />, label: "Bathroom", href: "/gallery#bathroom" },
  { icon: <FaPlus />, label: "Explore All", href: "/gallery" },
];

const ConceptToCompletion = () => {
  // Ripple handler
  const createRipple = (e : any) => {
    const circle = document.createElement("span");
    const button = e.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove(); // Remove old ripple
    button.appendChild(circle);
  };

  return (
    <section
      className="bg-[#D2EBD0] py-12 px-6 text-[#00423D] text-center"
      style={{
        WebkitTextStroke: "1px black",
        fontFamily: "'Abril Fatface', cursive",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-6xl text-[#00423D] font-abril">
          Concept to Completion
        </h2>
        <p className="mt-4 text-md md:text-2xl text-center text-black">
          Seamless End-to-End Interior Projects
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <a
              href={section.href}
              key={index}
              className="group transition-transform hover:scale-105 active:scale-95 duration-200"
            >
              <div
                className="p-4 bg-[#E8F5E9] rounded-full shadow flex flex-col items-center justify-center w-40 h-40 mx-auto 
                           border-4 border-transparent group-hover:border-teal-800 hover:shadow-lg 
                           transition-all duration-300 relative overflow-hidden cursor-pointer"
                onClick={createRipple}
              >
                <div className="text-3xl text-[#00423D]">{section.icon}</div>
                <h3 className="text-xl text-[#00423D] mt-2">{section.label}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptToCompletion;
