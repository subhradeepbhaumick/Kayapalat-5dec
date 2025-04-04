import React from "react";

const DesignIdeas = () => {
  return (
    <section className="bg-white py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Design Ideas</h2>
        <p className="mt-4 text-lg text-gray-700">
          Browse through our curated collection of interior design inspirations, from modern minimalism to luxurious aesthetics.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">False Ceiling</h3>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Kids Room</h3>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Bathroom</h3>
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg">See All</button>
      </div>
    </section>
  );
};

export default DesignIdeas;
