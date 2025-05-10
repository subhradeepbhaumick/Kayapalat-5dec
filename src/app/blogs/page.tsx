'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

interface Blog {
  excerpt: ReactNode;
  id: number;
  title: string;
  body: string;
  image: string;
  created_at: string;
  slug: string;
}

const BlogsPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blogs');
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // Sort blogs based on selected order
        const sortedBlogs = sortOrder === 'latest' 
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        setBlogs(sortedBlogs);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [sortOrder]);

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

  return (
    <section className="relative w-full min-h-screen bg-[#D2EBD0]">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-b from-[#00423D] via-[#2e8b57] to-[#D2EBD0] text-white pt-32 pb-24 px-6 overflow-hidden ">
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1
            className="text-4xl md:text-6xl font-abril mb-4 drop-shadow-lg font-extrabold tracking-wide"
            style={{
              fontFamily: "'Abril Fatface', cursive",
              letterSpacing: '1px'
            }}
          >
            <span className="text-[#D2EBD0]">Discover</span> <span className="text-[#00261a]">Our Stories</span>
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 font-black text-[#e0f7ef] drop-shadow-lg">
            Insights, Inspiration, and <span className="text-[#00261a]">Interior Design Excellence</span>
          </h2>
          <h3 className="text-lg md:text-xl text-[#b4ddc3] max-w-2xl mx-auto font-bold drop-shadow">
            Explore our collection of articles featuring the <span className="text-[#00261a] font-extrabold">latest trends</span>, expert tips, and <span className="text-[#00423D] font-extrabold">stunning transformations</span>.
          </h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-md relative">
              <div 
                className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-[#00423D] rounded-full transition-all duration-300 ease-in-out ${
                  sortOrder === 'latest' ? 'left-1' : 'left-[calc(50%+4px)]'
                }`}
              />
              <button
                onClick={() => setSortOrder('latest')}
                className={`relative px-6 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                  sortOrder === 'latest' ? 'text-white' : 'text-[#00423D]'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortOrder('popular')}
                className={`relative px-6 pl-12 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                  sortOrder === 'popular' ? 'text-white' : 'text-[#00423D]'
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-[#e8f5e9] rounded-xl p-4 border-2 border-teal-800 flex flex-col justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-80 object-cover rounded-xl mb-4 select-none border-2 border-[#00423D]"
                  draggable={false}
                />
                <h3 className="text-center mb-1 font-semibold text-lg">{blog.title}</h3>
                <hr className="border-t-[1px] border-gray-400 w-full mb-2" />
                <div 
                  className="text-sm mb-4 text-center min-h-[4.5rem] line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                />
                <button
                  onClick={() => router.push(`/blogs/${blog.slug}`)}
                  className="rounded-full border-2 border-[#00423D] transition-all cursor-pointer hover:bg-[#cbead1] px-6 py-1 text-sm text-[#00423D] font-medium flex items-center gap-2 hover:scale-105 active:scale-95 duration-200"
                >
                  Read More <FaPlus className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsPage; 