import React from "react";

const OurCreations = () => {
  return (
    <section className="bg-white py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Our Creations</h2>
        <p className="mt-4 text-lg text-gray-700">
          Explore our portfolio of beautifully designed interiors crafted by our expert designers.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Modern Living Room</h3>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Luxury Bedroom</h3>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Elegant Kitchen</h3>
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg">View Gallery</button>
      </div>
    </section>
  );
};

export default OurCreations;
