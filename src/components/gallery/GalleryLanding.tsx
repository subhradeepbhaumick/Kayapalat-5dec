// File: src/app/components/gallery/GalleryLanding.tsx
export default function GalleryLanding({ seoContent }: { seoContent: string | null }) {
    return (
        <>
            <section className="relative overflow-hidden bg-gradient-to-tr from-[#e7f5a0] via-[#dbead6] to-[#c9e7e0] py-20 px-6 text-center flex flex-col items-center">
                {/* Decorative SVG Pattern */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <svg width="100%" height="100%">
                        <pattern id="pattern1" width="120" height="120" patternUnits="userSpaceOnUse">
                            <circle cx="60" cy="60" r="28" fill="#c3e9da" opacity="0.16" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#pattern1)" />
                    </svg>
                </div>
                <h1 className="font-saira-stencil-one text-6xl md:text-7xl font-extrabold tracking-widest drop-shadow-xl text-[#11776B] mb-6 relative z-10">
                    Unleash Your Space
                </h1>
                <p className="mt-2 text-xl text-[#236061] font-inter font-medium relative z-10 drop-shadow">
                    Discover curated designs, crafted for your lifestyle.
                </p>
                <p className="mt-8 text-base md:text-lg text-[#225050] italic animate-bounce">↓ Scroll for inspiration</p>
            </section>
            {seoContent ? (
                <section className="max-w-3xl mx-auto my-8 bg-white/70 backdrop-blur-md border border-[#00423D]/10 rounded-xl px-8 py-8 shadow-xl">
                    <div dangerouslySetInnerHTML={{ __html: seoContent }} />
                </section>
            ) : (
                <p className="text-center text-gray-500 mt-6">No SEO content published yet.</p>
            )}
        </>
    );
}
