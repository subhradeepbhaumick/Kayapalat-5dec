'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaTag } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Interface updated to include tags
interface Blog {
  excerpt: string;
  id: number;
  title: string;
  image: string;
  created_at: string;
  slug: string;
  category_name?: string;
  tags?: { name: string; slug: string }[];
}

const OurBlogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        // Fetching only blogs marked as "featured"
        const response = await fetch('/api/blogs?featured=true', { cache: 'no-store' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blogs');
        }

        const { blogs: data } = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from server');
        }

        setBlogs(data);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  // --- Loading, Error, and Empty states ---
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00423D] mx-auto"></div>
        <p className="mt-4 text-[#00423D]">Loading Blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error: {error}</div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#00423D]">No featured blogs available at the moment.</p>
      </div>
    );
  }

  // --- Main Component Return ---
  return (
    <section className="relative w-full">
      <div className="bg-[#D2EBD0] py-12 px-6 text-[#00423D] text-center relative font-sans">
        <h2 className="text-5xl md:text-7xl text-[#00423D] font-abril" style={{ WebkitTextStroke: '1px black', fontFamily: "'Abril Fatface', cursive" }}>
          Our Blogs
        </h2>
        <div className="hidden md:block absolute right-10 top-40 -translate-y-1/2">
          <button onClick={() => router.push('/blogs')} className="border-2 border-[#00423D] bg-[#ffffffb8] rounded-full px-6 py-2 text-sm font-semibold text-[#00423D] cursor-pointer hover:bg-[#b4ddc3] transition-all duration-200">
            See All Blogs
          </button>
        </div>

        <div className="flex gap-6 flex-wrap mt-10 md:mt-20 justify-center">
          {/* --- New Card Design --- */}
          {blogs.map((blog) => (
            <div key={blog.id} className="w-80 bg-white rounded-xl group flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200/80 text-left">
              <div className="relative w-full h-52 rounded-t-xl overflow-hidden">
                <Image
                  src={blog.image || 'https://placehold.co/600x400/d2ebd0/00423d?text=Image'}
                  alt={blog.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform  border-2 rounded-[5%] duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-auto p-6 flex flex-col flex-grow">
                {blog.category_name && (
                  <p className="text-sm font-bold text-[#2e8b57] mb-2 uppercase tracking-wider">{blog.category_name}</p>
                )}

                <h3 className="font-bold text-gray-800 mb-3 text-lg leading-snug">{blog.title}</h3>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-auto">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag.slug} className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5  ">
                        <FaTag size={10} /> {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600 mt-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.excerpt || '' }} />

                
                
                <div className="mt-auto pt-4 border-t border-gray-200/80">
                  <button
                    onClick={() => router.push(`/blogs/${blog.slug}`)}
                    className="w-full rounded-full border-2 border-[#00423D] transition-all bg-[#00423D] text-white hover:bg-[#00261a] px-6 py-2 text-sm font-medium flex cursor-pointer items-center justify-center gap-2"
                  >
                    Read Story <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <button onClick={() => router.push('/blogs')} className="border-2 border-[#00423D] rounded-full px-6 py-2 text-lg font-semibold text-[#00423D]">
            See All Blogs
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurBlogs;