import React from "react";

const HappinessGuarantee = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Happiness Guarantee</h2>
        <p className="mt-4 text-lg text-gray-700">
          Your satisfaction is our top priority. We ensure quality work with a money-back guarantee if expectations aren't met.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">5-Year Warranty</h3>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">On-Time Completion</h3>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Best Price Guaranteed</h3>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Dedicated Project Manager</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappinessGuarantee;
