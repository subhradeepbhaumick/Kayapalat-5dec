"use client";
import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { X, ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientReview } from "@/types/index";

const countryOptions = [
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "USA (+1)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+65", label: "Singapore (+65)" },
];

function convertToEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

const ClientChronicles = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [selectedCountry, setSelectedCountry] = useState("India (+91)");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const charLimit = 250;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/client-reviews");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Could not load client reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  const validatePhone = (phone: string, countryCode: string) => {
    const phoneRegex = /^\d{10}$/;
    const countryCodeRegex = /^\+\d{1,3}$/;
    return phoneRegex.test(phone) && countryCodeRegex.test(countryCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setIsValid(validatePhone(value, countryCode) && charCount <= charLimit);
  };

  const handleCountrySelect = (value: string) => {
    const selected = countryOptions.find((c) => c.label === value);
    if (selected) {
      setSelectedCountry(value);
      setCountryCode(selected.value);
      setIsValid(validatePhone(phone, selected.value) && charCount <= charLimit);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
    setIsValid(validatePhone(phone, countryCode) && value.length <= charLimit);
  };

  const handleRequestCallback = () => {
    if (isValid) {
      toast.success("📞 Callback Requested!", {
        description: `📱 Phone: ${countryCode} ${phone}`,
        duration: 1500,
        action: {
          label: <X size={18} className="cursor-pointer" />,
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const nextTestimonial = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevTestimonial = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const nextImage = () => {
    if (reviews[currentIndex].reviewImages && reviews[currentIndex].reviewImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % reviews[currentIndex].reviewImages.length);
    }
  };

  const prevImage = () => {
    if (reviews[currentIndex].reviewImages && reviews[currentIndex].reviewImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + reviews[currentIndex].reviewImages.length) % reviews[currentIndex].reviewImages.length);
    }
  };

  return (
    <section className="bg-[#D2EBD0] py-12 px-4 md:px-16 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-7xl text-[#00423D] text-center stroke-text drop-shadow" style={{ WebkitTextStroke: '1px black', fontFamily: "'Abril Fatface', cursive" }}>
            Client Chronicles
          </h2>
          <p className="mt-4 text-gray-800 text-base leading-relaxed">
            At <span className="font-semibold text-[#00423D]">Kayapalat</span>, we bridge the gap between interior designers and clients looking for perfection. Our platform is built on creativity, trust, and seamless collaboration, ensuring every project turns into a masterpiece.
          </p>
          <p className="mt-3 text-gray-800 text-base italic">
            But don’t just take our word for it—hear it from those who’ve experienced it firsthand.
          </p>

          <h3 className="mt-6 text-xl font-bold text-black">Get a Free Consultation !!!</h3>

          <div className="mt-4 bg-white p-4 rounded-lg shadow space-y-2">
            <div className="flex gap-2">
              <Select onValueChange={handleCountrySelect} defaultValue={selectedCountry}>
                <SelectTrigger className="w-1/3 p-2 border border-gray-300 opacity-100 rounded-lg bg-white hover:bg-gray-100">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                  {countryOptions.map((country) => (
                    <SelectItem key={country.value} value={country.label}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="text"
                placeholder="Phone Number(10 Digits)"
                value={phone}
                onChange={handlePhoneChange}
                className="p-2 border border-gray-300 rounded-lg w-2/3"
              />
            </div>
            <textarea
              rows={3}
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter your message (Max 250 characters)"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
            />
            <p className={`text-right text-xs ${charCount > 250 ? "text-red-500" : "text-gray-600"}`}>
              {charCount}/250
            </p>
            <button
              onClick={handleRequestCallback}
              disabled={!isValid}
              className={`w-full py-2  rounded-lg transition-all duration-200 ${isValid
                ? 'bg-[#295A47] text-white cursor-pointer hover:bg-[#1e4c3a] active:scale-95 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Request a Callback
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <h3
            className="text-3xl md:text-4xl text-[#00423D] stroke-text text-center mb-2"
            style={{
              WebkitTextStroke: "1px black",
              fontFamily: "'Abril Fatface', cursive",
            }}
          >
            <span className="p-2 glitter inline-block"> ✨ </span>
            Real Stories
            <span className="p-2 glitter inline-block"> ✨ </span>
          </h3>

          <h3
            className="text-3xl md:text-4xl text-[#00423D] stroke-text text-center mb-6"
            style={{
              WebkitTextStroke: "1px black",
              fontFamily: "'Abril Fatface', cursive",
            }}
          >
            Real Transformations
          </h3>

          <p className="text-center text-gray-800 text-[12px] md:text-lg mt-2 mb-4">
            Our clients are our best advocates. Here’s what they have to say:
          </p>

          <div>
            <div className="relative bg-white p-6 rounded-2xl border border-gray-300 shadow-lg max-w-md mx-auto text-center transition-all duration-300 hover:shadow-2xl">
              {loading && <p>Loading testimonials...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && !error && reviews.length > 0 && (
                <>
                  {/* Media section (auto slide) */}
                  {reviews[currentIndex].reviewImages &&
                    reviews[currentIndex].reviewImages.length > 0 && (
                      <div className="mt-2 relative w-full h-64 overflow-hidden rounded-xl shadow-md border border-gray-200">
                        {(() => {
                          const currentMedia = reviews[currentIndex].reviewImages[currentImageIndex];
                          if (currentMedia.type === "image") {
                            return (
                              <img
                                src={currentMedia.url}
                                alt="Client project"
                                className="w-full h-full object-cover transition-all duration-700 ease-in-out rounded-xl"
                              />
                            );
                          } else if (currentMedia.type === "video") {
                            const videoUrl = currentMedia.url.includes("youtube.com") || currentMedia.url.includes("youtu.be")
                              ? convertToEmbedUrl(currentMedia.url)
                              : currentMedia.url;
                            return (
                              <iframe
                                src={videoUrl}
                                className="w-full h-full rounded-xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Client video"
                              />
                            );
                          }
                          return null;
                        })()}
                        {/* Glassmorphism arrows for media navigation */}
                        {reviews[currentIndex].reviewImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-1 hover:bg-white/30 transition-all duration-200"
                            >
                              <ArrowLeftCircle size={24} className="text-green-800/70" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-1 hover:bg-white/30 transition-all duration-200"
                            >
                              <ArrowRightCircle size={24} className="text-green-800/70" />
                            </button>
                          </>
                        )}
                      </div>
                    )}

                  {/* Profile block - horizontal layout */}
                  <div className="mt-4 flex items-start gap-3">
                    {reviews[currentIndex].profileImage ? (
                      <img
                        src={reviews[currentIndex].profileImage}
                        alt={reviews[currentIndex].name}
                        className="w-14 h-14 rounded-full border border-gray-400 object-cover shadow"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#295A47] text-white flex items-center justify-center font-bold text-lg">
                        {reviews[currentIndex].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h4 className="font-bold text-gray-900">
                        {reviews[currentIndex].name}
                      </h4>
                      {/* Star rating */}
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < reviews[currentIndex].rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote + text - below profile */}
                  <div className="mt-4 flex items-start gap-2">
                    <FaQuoteLeft className="text-3xl ml-5 mr-4 text-[#00423D] flex-shrink-0" />
                    <div className="flex flex-col">
                      <p className="italic text-gray-700 text-base leading-relaxed text-left">
                        {reviews[currentIndex].message.length > 150 && !expandedComments.has(currentIndex) ? (
                          <>
                            {reviews[currentIndex].message.substring(0, 150)}...
                            <button
                              onClick={() => setExpandedComments(prev => new Set(prev).add(currentIndex))}
                              className="text-[#00423D] font-semibold mt-1 hover:underline"
                            >
                              Read more
                            </button>
                          </>
                        ) : (
                          <>
                            {reviews[currentIndex].message}
                            {reviews[currentIndex].message.length > 150 && (
                              <button
                                onClick={() => setExpandedComments(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(currentIndex);
                                  return newSet;
                                })}
                                className="text-[#00423D] font-semibold mt-1 hover:underline"
                              >
                                Read less
                              </button>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Navigation buttons - below comment part */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={prevTestimonial}
                      className="text-[#00423D] opacity-70 hover:opacity-100 transition"
                    >
                      <ArrowLeftCircle size={30} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="text-[#00423D] opacity-70 hover:opacity-100 transition"
                    >
                      <ArrowRightCircle size={30} />
                    </button>
                  </div>
                </>
              )}

              {!loading && !error && reviews.length === 0 && (
                <p>No testimonials available at the moment.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ClientChronicles;