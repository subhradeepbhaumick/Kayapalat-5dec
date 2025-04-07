import React from "react";
import { FaShieldAlt, FaTools, FaHeadset, FaClock, FaUserTie } from "react-icons/fa";

const features = [
  {
    label: "Durability",
    icon: <FaShieldAlt size={24} />,
  },
  {
    label: "Customized Quality",
    icon: <FaTools size={24} />,
  },
  {
    label: "Post Sales Service",
    icon: <FaHeadset size={24} />,
  },
  {
    label: "On Time Delivery",
    icon: <FaClock size={24} />,
  },
  {
    label: "Dedicated Manager",
    icon: <FaUserTie size={24} />,
  },
];

const HappinessGuarantee = () => {
  return (
    <section className="bg-[#D2EBD0] py-12 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-7xl text-[#00423D] text-center stroke-text"
          style={{
            WebkitTextStroke: '1px black',
            fontFamily: "'Abril Fatface', cursive",
          }}
        >
          Our Happiness Guarantee
        </h2>
        <p
          className="mt-4 md:mt-8 text-md md:text-4xl text-black text-center"
          style={{
            fontFamily: "'Abril Fatface', cursive",
          }}
        >
          <span className="p-2 glitter inline-block"> ✨ </span>
         “ If you’re not happy, we’re not happy ” 
         <span className="p-2 glitter inline-block"> ✨ </span>
        </p>
        <p
          className="mt-6 text-base md:text-xl text-justify text-gray-700"
          style={{
            fontFamily: "'Abril Fatface', cursive",
          }}
        >
          We understand that designing your space can feel overwhelming, but we’re here to make it seamless and enjoyable. If your design doesn’t meet your expectations for any reason, just let us know—we’ll work with you until it’s perfect!
        </p>

        {/* Feature Buttons */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 cursor-pointer md:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-teal-800 text-teal-800 bg-white text-center 
              transition-all duration-300 hover:bg-teal-800 hover:text-white hover:scale-95 shadow-md 
              select-none stroke-text
              ${features.length % 2 === 1 && index === features.length - 1 ? 'col-span-2 justify-self-center pr-11 pl-11  sm:col-span-1' : ''}`}
            >
              <div className="mb-2">{feature.icon}</div>
              <span className="text-sm md:text-base font-bold">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HappinessGuarantee;
