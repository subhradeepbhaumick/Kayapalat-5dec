import  HeroSection  from "@/components/home/HeroSection";
import  OurCreations  from "@/components/home/OurCreations";
import ConceptToCompletion  from "@/components/home/ConceptToCompletion";
import  AboutUs  from "@/components/home/AboutUs";
import  { DesignIdeas }  from "@/components/home/DesignIdeas";
import  ClientChronicles  from "@/components/home/ClientChronicles";
import  HowWeWork  from "@/components/home/HowWeWork";
import  OurBlogs  from "@/components/home/OurBlogs";
import  HappinessGuarantee  from "@/components/home/HappinessGuarantee";
import  FAQ  from "@/components/FAQ";

const faqs = [
  {
    question: "How do I request a callback?",
    answer: "Just head over to our homepage, click on the 'Request a Callback' button and fill out the form — our team will get back to you shortly."
  },
  {
    question: "Can I upload multiple images to my profile gallery?",
    answer: "Yes! Go to your profile, click on 'Edit Gallery' and you can add, remove, or reorder images anytime."
  },
  {
    question: "Is my data secure with Kayapalat?",
    answer: "Absolutely. We use industry-standard encryption and secure authentication methods to protect your data."
  },
] 


export default function Home() {
  return (
    <main className="w-full mx-auto">
      <HeroSection />
      <OurCreations page="home" />
      <ConceptToCompletion />
      <AboutUs />
      <DesignIdeas />
      <ClientChronicles />
      <HowWeWork />
      <OurBlogs />
      <FAQ faqs={faqs}/>
      <HappinessGuarantee />
    </main>
  );
}
