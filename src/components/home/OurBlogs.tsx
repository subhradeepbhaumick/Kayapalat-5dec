'use client';

import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const blogData = [
  {
    id: 1,
    title: 'Designing Interiors that Speak',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem...',
    image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67cd6db4a3954.jpeg&width=370&height=373',
  },
  {
    id: 2,
    title: 'Modern Living Room Inspirations',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Temporibus autem quibusdam et aut officiis debitis aut rerum...',
    image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67a4eeab58ecd.jpg&width=370&height=373',
  },
  {
    id: 3,
    title: 'Maximizing Small Spaces',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus...',
    image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-677bb41a77c19.jpg&width=370&height=373',
  },
  {
    id: 4,
    title: 'The Art of Color Coordination',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus...',
    image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67a4eeab58ecd.jpg&width=370&height=373',
  },
];

const OurBlogs = () => {
  const router = useRouter();

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
          className="border-2 border-[#00423D] rounded-full px-6 py-2 text-sm font-semibold text-[#00423D] cursor-pointer hover:bg-[#b4ddc3] transition-all duration-200"
        >
          See All
        </button>
      </div>

      <div className="flex gap-6 flex-wrap mt-10 md:mt-20 justify-center">
        {blogData.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#e8f5e9] rounded-xl p-4 border-2 border-teal-800 w-72 flex flex-col justify-between items-center shadow-md "
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-fill rounded-xl mb-4 border-2 border-[#00423D]"
            />
            <h3 className="text-center mb-1">{blog.title}</h3>
            <hr className="border-t-[1px] border-gray-400 w-full mb-2" />
            <p className="text-sm mb-4 text-center">{blog.body}</p>
            <button
              onClick={() => router.push(`/blog/${blog.title.split(" ")[0]}`)}
              className="rounded-full border-2 border-[#00423D] transition-all cursor-pointer hover:bg-[#cbead1] px-6 py-1 text-sm text-[#00423D] font-medium flex pr-20 pl-20  items-center gap-2  hover:scale-105 active:scale-95 duration-200"
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
          className="border-2 border-[#00423D] rounded-full px-6 py-2 text-sm font-semibold text-[#00423D] cursor-pointer hover:border-3 transition-all duration-200"
        >
          See All
        </button>
      </div>
    </div>
    </section>
  );
};

export default OurBlogs;
