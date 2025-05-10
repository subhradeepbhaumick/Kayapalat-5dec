"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  body: string;
  image: string;
  created_at: string;
  slug: string;
  content: string;
}

export default function BlogReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error || !blog) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <img src={blog.image} alt={blog.title} className="w-full rounded-xl mb-6" />
      <h1 className="text-4xl font-bold mb-2 text-[#00423D]">{blog.title}</h1>
      <div className="text-gray-500 mb-6">{new Date(blog.created_at).toLocaleDateString()}</div>
      <article className="prose prose-lg text-[#222]" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </section>
  );
} 