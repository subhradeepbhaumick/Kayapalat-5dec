import React from "react";

const ClientChronicles = () => {
  return (
    <section className="bg-white py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Client Chronicles</h2>
        <p className="mt-4 text-lg text-gray-700">
          At Kayapalat, we bridge the gap between interior designers and clients looking for perfection.
          Our platform is built on creativity, trust, and seamless collaboration, ensuring every project turns into a masterpiece.
        </p>
        <div className="mt-8 space-y-6">
          <div className="border p-6 rounded-lg shadow-md">
            <p className="italic text-gray-600">“Our top four requests for our dream home were captured perfectly: it's minimalistic, modern, spacious, and colorful!”</p>
            <h3 className="mt-2 font-bold text-gray-900">Mr. & Mrs. Saket Gupta</h3>
            <p className="text-gray-600">Business Owner</p>
          </div>
          <div className="border p-6 rounded-lg shadow-md">
            <p className="italic text-gray-600">“Kayapalat made the entire design process seamless, and the results exceeded our expectations!”</p>
            <h3 className="mt-2 font-bold text-gray-900">Mr. Dhiman Majumder</h3>
            <p className="text-gray-600">Home Owner</p>
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg">Get a Free Consultation</button>
      </div>
    </section>
  );
};

export default ClientChronicles;
