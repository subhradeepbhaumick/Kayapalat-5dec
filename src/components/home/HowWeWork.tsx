import React from "react";

const HowWeWork = () => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <h2 
        className="text-5xl sm:text-7xl md:text-8xl text-center text-[#00423D] py-10 
                   bg-[#D2EBD0] md:bg-[#D2EBD0] sm:bg-[#E8F5E9] transition-all duration-300"
        style={{ WebkitTextStroke: "1px black", fontFamily: "'Abril Fatface', cursive" }}
      >
        How We Work
      </h2>

      {/* Image Section (Switches Dynamically for Mobile) */}
      <div className="flex-1 flex justify-center items-center w-full">
        {/* Desktop Image (Shown on md and larger) */}
        <img 
          src="/how-we-work.png" 
          alt="How We Work"
          className="hidden md:block md:pr-40 md:pl-40 w-full h-full select-none object-cover"
          draggable={false}
        />
        
        {/* Mobile Image (Shown on small screens, with reduced brightness) */}
        <img 
          src="/how-we-work-mobile.png" 
          alt="How We Work Mobile"
          className="block md:hidden w-full h-full select-none object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default HowWeWork;
