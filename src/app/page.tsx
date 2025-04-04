import  HeroSection  from "@/components/home/HeroSection";
import  OurCreations  from "@/components/home/OurCreations";
import ConceptToCompletion  from "@/components/home/ConceptToCompletion";
import  AboutUs  from "@/components/home/AboutUs";
import  DesignIdeas  from "@/components/home/DesignIdeas";
import  ClientChronicles  from "@/components/home/ClientChronicles";
import  HowWeWork  from "@/components/home/HowWeWork";
import  OurBlogs  from "@/components/home/OurBlogs";
import  HappinessGuarantee  from "@/components/home/HappinessGuarantee";

export default function Home() {
  return (
    <main className="w-full mx-auto">
      <HeroSection />
      <OurCreations />
      <ConceptToCompletion />
      <AboutUs />
      <DesignIdeas />
      <ClientChronicles />
      <HowWeWork />
      <OurBlogs />
      <HappinessGuarantee />
    </main>
  );
}
