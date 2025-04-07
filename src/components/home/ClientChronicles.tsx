"use client";
import React, { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { X, ArrowRightCircle, ArrowLeftCircle, Play } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Parser to extract YouTube Video ID from full URL
const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const testimonials = [
  {
    name: "Mr. & Mrs. Saket Gupta",
    avatar: "https://i.pravatar.cc/150?img=32",
    title: "Business Owner",
    quote:
      "Our top four requests for our dream home were captured perfectly: it's minimalistic, modern, spacious, and colorful!",
    video: "https://youtu.be/HzWJptn8EQQ?si=T3pgUcc3dgpDE0vD",
  },
  {
    name: "Mr. Dhiman Majumder",
    avatar: "https://i.pravatar.cc/150?img=45",
    title: "Home Owner",
    quote:
      "Kayapalat made the entire design process seamless, and the results exceeded our expectations!",
    video: "https://youtu.be/O40tf-FxO_E?si=uluVsYQHGIy7G8Sv",
  },
];

const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names
    .filter((n) => n.length > 0)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return initials;
};


const countryOptions = [
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "USA (+1)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+65", label: "Singapore (+65)" },
];

const ClientChronicles = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [selectedCountry, setSelectedCountry] = useState("India (+91)");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const charLimit = 250;

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

  const openVideoModal = (videoUrl: string) => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      setSelectedVideo(videoId);
      setModalOpen(true);
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVideo(null);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentVideoId = extractVideoId(testimonials[currentIndex].video);

  return (
    <section className="bg-[#D2EBD0] py-12 px-4 md:px-16 relative">
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/30"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // prevents modal from closing when clicking inside
          >
            <button
              className="absolute top-3 cursor-pointer right-4 text-red-600 font-bold text-xl"
              onClick={closeModal}
            >
              <X size={28} />
            </button>
            {selectedVideo && (
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            )}
          </div>
        </div>
      )}


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
          <h3 className="text-3xl md:text-4xl text-[#00423D] stroke-text text-center mb-2" style={{ WebkitTextStroke: '1px black', fontFamily: "'Abril Fatface', cursive" }}>
          <span className="p-2 glitter inline-block"> ✨ </span>
           Real Stories 
           <span className="p-2 glitter inline-block"> ✨ </span>
          </h3>
          <h3 className="text-3xl md:text-4xl text-[#00423D] stroke-text text-center mb-6" style={{ WebkitTextStroke: '1px black', fontFamily: "'Abril Fatface', cursive" }}>
            Real Transformations
          </h3>
          <p className="text-center text-gray-800 text-[12px] md:text-lg mt-2 mb-4">
            Our clients are our best advocates. Here’s what they have to say:
          </p>

          <div className="relative">
            <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm max-w-md mx-auto">
              <div className="relative cursor-pointer" onClick={() => openVideoModal(testimonials[currentIndex].video)}>
                <img
                  src={`https://img.youtube.com/vi/${currentVideoId}/0.jpg`}
                  alt="video thumbnail"
                  className="rounded-lg w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <Play size={48} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[#00423D] mt-4">
                <FaQuoteLeft className="text-xl mt-1" />
                <p className="italic text-gray-700 text-sm">{testimonials[currentIndex].quote}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {testimonials[currentIndex].avatar ? (
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={`${testimonials[currentIndex].name} avatar`}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#295A47] text-white flex items-center justify-center font-semibold text-sm border border-gray-300 shadow-sm">
                    {getInitials(testimonials[currentIndex].name)}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 text-base">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm italic text-gray-600">{testimonials[currentIndex].title}</p>
                </div>
              </div>


              <div className="flex justify-between items-center mt-4">
                <button onClick={prevTestimonial} className="text-[#00423D] cursor-pointer">
                  <ArrowLeftCircle size={28} />
                </button>
                <button onClick={nextTestimonial} className="text-[#00423D] cursor-pointer">
                  <ArrowRightCircle size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientChronicles;
