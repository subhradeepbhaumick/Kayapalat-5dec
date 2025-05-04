'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

interface Blog {
  id: number;
  title: string;
  body: string;
  image: string;
}

const OurBlogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // First test the database connection
        const testResponse = await fetch('/api/test-db');
        const testData = await testResponse.json();
        
        if (!testData.success) {
          throw new Error(`Database connection failed: ${testData.details}`);
        }

        console.log('Database connection test successful');

        // Now fetch the blogs
        const response = await fetch('/api/blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        console.log('Blogs API response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Blogs API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch blogs');
        }

        const data = await response.json();
        console.log('Fetched blogs data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setBlogs(data);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00423D] mx-auto"></div>
        <p className="mt-4 text-[#00423D]">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="border-2 border-[#00423D] rounded-full px-6 py-2 text-sm font-semibold text-[#00423D] cursor-pointer hover:bg-[#b4ddc3] transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#00423D]">No blogs available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <div className="bg-[#D2EBD0] py-12 px-6 text-[#00423D] text-center relative font-sans">
        <h2
          className="text-5xl md:text-7xl text-[#00423D] font-abril"
          style={{
            WebkitTextStroke: '1px black',
            fontFamily: "'Abril Fatface', cursive",
          }}
        >
          Our Blogs
        </h2>

        {/* See All button for desktop */}
        <div className="hidden md:block transition-transform hover:scale-105 active:scale-95 duration-200 absolute right-10 top-35">
          <button
            onClick={() => router.push('/blogs')}
            className="border-2 border-[#00423D] bg-[#ffffffb8] rounded-full px-6 py-2 text-sm font-semibold text-[#00423D] cursor-pointer hover:bg-[#b4ddc3] transition-all duration-200"
          >
            See All
          </button>
        </div>

        <div className="flex gap-6 flex-wrap mt-10 md:mt-20 justify-center">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#e8f5e9] rounded-xl p-4 border-2 border-teal-800 w-72 flex flex-col justify-between items-center shadow-md"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-fill rounded-xl mb-4 select-none border-2 border-[#00423D]"
                draggable={false}
              />
              <h3 className="text-center mb-1">{blog.title}</h3>
              <hr className="border-t-[1px] border-gray-400 w-full mb-2" />
              <p className="text-sm mb-4 text-center">{blog.body}</p>
              <button
                onClick={() => router.push(`/blogs/${blog.title.replace(/\s+/g, "-")}`)}
                className="rounded-full border-2 border-[#00423D] transition-all cursor-pointer hover:bg-[#cbead1] px-6 py-1 text-sm text-[#00423D] font-medium flex pr-20 pl-20 items-center gap-2 hover:scale-105 active:scale-95 duration-200"
              >
                Read More <FaPlus className="text-xs" />
              </button>
            </div>
          ))}
        </div>

        {/* See All button for mobile */}
        <div className="mt-10 md:hidden">
          <button
            onClick={() => router.push('/blogs')}
            className="border-2 border-[#00423D] pr-25 pl-25 rounded-full px-6 py-2 text-lg font-semibold text-[#00423D] cursor-pointer hover:border-3 transition-all duration-200"
          >
            See All
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurBlogs;
