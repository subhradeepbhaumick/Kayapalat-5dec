import React from "react";

const OurBlogs = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Our Blogs</h2>
        <p className="mt-4 text-lg text-gray-700">
          Stay updated with the latest interior design trends, tips, and inspirations from our experts.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Top 10 Home Makeover Ideas</h3>
            <p className="text-gray-600 mt-2">Revamp your space effortlessly with these expert recommendations.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">The Psychology of Colors</h3>
            <p className="text-gray-600 mt-2">Understand how colors influence your mood and space aesthetics.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">Minimalist vs. Maximalist Design</h3>
            <p className="text-gray-600 mt-2">Which style suits your personality and home best?</p>
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg">Read More</button>
      </div>
    </section>
  );
};

export default OurBlogs;
