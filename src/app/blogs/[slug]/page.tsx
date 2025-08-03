// File: src/app/blogs/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { formatDate, calculateReadTime } from '@/lib/utils';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ScrollToTopButton } from './ScrollToTopButton'; // NEW: Import ScrollToTopButton
import { Tag, Folder } from 'lucide-react'; // NEW: Import icons
import { BlogHeroSection } from './BlogHeroSection'; // NEW: Import BlogHeroSection


const BackgroundPattern = ({ color = '#00423D', opacity = 0.05 }) => {
  const encodedColor = encodeURIComponent(color);
  const svgUrl = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
  return <div className="absolute  inset-0 z-0 pointer-events-none" style={{ backgroundImage: svgUrl }}></div>;
};
// --- INTERFACES ---
interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  created_at: string;
  slug: string;
  content: string;
  category_id: number;
  category_name: string;
  tags: { id: number; name: string; slug: string }[];
  before_image?: string;
  after_image?: string;
}
interface SimilarBlog {
  id: number;
  title: string;
  slug: string;
  image: string;
  created_at: string;
  content: string;
}

// --- DATA FETCHING ---
async function getBlog(slug: string): Promise<Blog> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  return res.json();
}

async function getSimilarBlogs(blog: Blog): Promise<SimilarBlog[]> {
  const tagIds = blog.tags.map(t => t.id).join(',');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/similar?currentId=${blog.id}&categoryId=${blog.category_id}&tags=${tagIds}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// --- SUB-COMPONENTS ---
const BlogMeta = ({ blog }: { blog: Blog }) => {
  const readTime = calculateReadTime(blog.content);
  const formattedDate = formatDate(blog.created_at);
  return (
    <div className="flex flex-wrap  items-center gap-x-1 border-b border-[#00423D]  gap-y-2 text-gray-500 mb-4 pb-4">
      <div className="flex items-center gap-2">
        <Image src="/favicon.png" alt="Team KayaPalat" width={32} height={32} className="rounded-full  border-2 border-[#00423D]" />
        <span className='text-[#00423D] font-semibold'>Team KayaPalat</span>
      </div>
      <span>&middot;</span>
      <div dangerouslySetInnerHTML={{ __html: formattedDate }} />
      <span>&middot;</span>
      <span>{readTime} min read</span>
    </div>
  );
};

// NEW: Sub-component for displaying category and tags
const BlogTagsAndCategory = ({ blog }: { blog: Blog }) => (
  <div className="flex flex-wrap items-center gap-3 mb-4">
    <span className="flex items-center gap-2 bg-[#00423D] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
      <Folder size={12} />
      {blog.category_name}
    </span>
    {blog.tags.map(tag => (
      <span key={tag.id} className="bg-[#e0f7ef] text-xs text-[#00423D] border border-[#00423D] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
        <Tag size={12} />
        {tag.name}
      </span>
    ))}
  </div>
);


const Sidebar = ({ similarBlogs }: { similarBlogs: SimilarBlog[] }) => (
  <aside className="sticky top-24">
    <h3 className="text-xl font-bold mb-4 text-gray-800">Similar Articles</h3>

    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {similarBlogs.length > 0 ? similarBlogs.map(blog => {
        const readTime = calculateReadTime(blog.content);
        const formattedDate = formatDate(blog.created_at);
        return (
          <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group flex gap-4 items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} className="rounded-md" />
            </div>
            <div>
              <h6 className="font-bold text-sm text-gray-900 group-hover:text-[#00423D] transition-colors line-clamp-2">{blog.title}</h6>
              <div className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: `${formattedDate} &middot; ${readTime} min read` }} />
            </div>
          </Link>
        )
      }) : <p className="text-sm text-gray-500">No similar articles found.</p>}
    </div>


    <div className="">
      {/* UPDATED: Added shadow */}
      <div className="mt-8 bg-white p-6 rounded-xl border-2 border-[#00423D] text-center shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Talk to an Expert</h3>
        <p className="mb-4 text-gray-600 text-sm">Get a free consultation for your dream home.</p>
        <Link href="/contact-us" className="bg-[#00423D] text-white font-bold px-4 py-2 text-sm rounded-full hover:bg-[#00261a] transition">
          Contact Us
        </Link>
      </div>

      {/* UPDATED: Inverted color scheme and added shadow */}
      <div className="mt-6 bg-[#00423D] text-white p-6 rounded-xl text-center shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">Plan Your Project</h3>
        <p className="mb-4 text-gray-300 text-sm">Use our calculator to get a personalized estimate.</p>
        <Link href="/estimate" className="bg-white text-[#00423D] font-bold px-4 py-2 text-sm rounded-full hover:bg-gray-200 transition">
          Get an Estimate
        </Link>
      </div>
    </div>
  </aside>
);

// --- MAIN PAGE COMPONENT ---
export default async function BlogReadPage({ params }: { params: { slug: string } }) {
  await params;
  const blog = await getBlog(params.slug);
  const similarBlogs = await getSimilarBlogs(blog);

  return (
    <>
      <ScrollToTopButton /> {/* NEW: Added scroll to top button */}

      <BlogHeroSection />

      <section className="relative bg-[#F4F7F4] py-16 px-6">
        <BackgroundPattern />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-12">

          <div className="lg:col-span-7">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href={`/blogs/${blog.slug}`}>{blog.title}</BreadcrumbLink></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl md:text-4xl font-bold my-4 text-[#00423D]">{blog.title}</h2>

            {/* NEW: Display Category and Tags */}
            <BlogTagsAndCategory blog={blog} />
            <BlogMeta blog={blog} />
            <p className="text-lg  text-gray-600 mb-4">{blog.excerpt}</p>


            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
              <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} />
            </div>

            <article
              className="prose prose-lg max-w-none text-[#222]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          <div className="lg:col-span-3">
            <Sidebar similarBlogs={similarBlogs} />
          </div>
        </div>
      </section>
    </>
  );
}