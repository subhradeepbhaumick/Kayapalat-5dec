import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
        <p className="mt-4 text-lg text-gray-700">
          At Kayapalat, we are dedicated to transforming your spaces into personalized
          sanctuaries that reflect your unique style and needs.
        </p>
        <blockquote className="mt-4 italic text-gray-600">
          “Our mission is to make high-quality interior design accessible and affordable for everyone.”
        </blockquote>
        <p className="mt-4 text-gray-700">
          We believe that great design has the power to enhance your life. Let us help you create
          a space that you'll love to live in.
        </p>
        <div className="mt-6 flex justify-center space-x-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">10 +</h3>
            <p className="text-gray-600">Awards Gained</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">350 +</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">10 +</h3>
            <p className="text-gray-600">Years of Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
