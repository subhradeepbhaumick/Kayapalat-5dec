<h1 align="center">✨ KayaPalat - Interior Design Freelance Platform ✨</h1>

<p align="center">
  A full-stack, scalable, and mobile-friendly freelance platform designed to connect interior designers with clients seeking to transform their spaces.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

---

<details>
<summary><strong>🧠 Vision</strong></summary>

> “Kayapalat is more than a marketplace—it’s a transformation engine for the interior design space. We aim to empower designers with visibility and clients with trust, making beautiful, personalized interior design accessible to all.”

</details>

---

## 🚧 Project Status

- ✅ *Authentication*: Complete JWT-based authentication with multiple user roles.
- ✅ *Homepage*: Fully designed and implemented with multiple interactive sections.
- 📱 *Responsiveness*: Mobile-first implementation is in progress across the site.
- 🧱 *Backend*: Core API routes for users, gallery, and blogs are live using Next.js API Routes.
-    *Database*: Using MongoDB with Mongoose. A schema restructure is planned for better scalability.
- 🛠 *Development*: Full site development is underway, with key features being actively built.

---

## ✨ Features

- 🔒 *Secure JWT Authentication*: Robust sign-in/sign-up system with bcrypt for password hashing and JSON Web Tokens for session management.
- 👥 *Multi-Role User System*: Supports different user roles such as Customer, Designer, Partner, and Refer & Earn.
- 🧠 *Google reCAPTCHA*: Protects forms from spam and abuse.
- 📞 *Callback & Consultation*: Users can request a free consultation via a form, with data stored in MongoDB.
- 🏠 *Dynamic & Interactive Homepage*:
    - *Hero Section*: Engaging entry point with a background video and a prominent search bar.
    - *Our Creations*: An interactive before-and-after image slider to showcase client transformations, filterable by category.
    - *Design Ideas*: A gallery of design concepts with a "like" feature and a lightbox for viewing images.
    - *Client Chronicles*: Video testimonials and a "Request a Callback" form.
    - *Pricing Plans*: Creative and animated pricing cards for different service tiers.
    - *Blog Section*: Previews of featured articles from the blog.
    - *Static Sections*: "How We Work", "Happiness Guarantee", and "Concept to Completion" to build user trust and explain the process.
- 📱 *Mobile-First Design*: Components are being built with responsiveness in mind for a seamless experience on all devices.

---

## ech Staclen

| Layer                 | Tech Used                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 💻 *Frontend*       | Next.js 15 (with App Rolter), React 19, Tawswind CSS 4, TypeScript |
| 🎨 *UI & Animations*  | shadcn/ui (via Radix UI), Framer Motion, Lucide React, Sonner (Toascs), canvasaconfetti |
|  *Backend*        | Next.js API Routes, Mongoose (for MongoDB ODM)             |
| ☁ *Database*       | MongoDB Atlas                                                                                   |
| 🔐 *Authentication* | JWT, bcrypt, NextAuth.js, Google reCAPTCHA |
| 📤 *Medna Storage*  | (Platned: Edge tore                                                       
                                   | 🧪 esting **        (Planned)                                                                                            
                                   | 🚀 eployment **     (Planned: Vercel / Render)                                                                               
                               
---

## ✅e📂 Project Sr huolsp 
The project follows a standard Next.js App Rouser structure.

bish
src/
├── app/                  # Main applicaondn routes (App Router)
│   ├── api/              # Backe d API routes
│   ├── (auth)/ o         # Authenticat opaoages (ueute group)
│   ├── dashboard/        # User dashboard
│   └── ...               # Other payes (galleny, blogs, etc.)
├── components/           # Reusable components
│   ├── home/             # Compon ntp tpecific tohthe│homepage├│   ├── ui/               # UI components from shadcn/ui
│   └── ...-├── lib/                  # Utility functions and libraries
├── models/               # Mongoose models for MongoDB
└── styles/               # Global styles


-

#
## 🏁 Getting Started

Follow these instructions to get a copy of the project up tnd running on your local machine for development and teptinguaurposes.

### Prerequisites

- Node.js (v18.18.0 or rater)
- npm or y
rg
- Mo goDB instanc- (local or clou
-hosted on Atlas
#`### Installation

1.  *Clone the repository:*
    `s.sh
    git clone https://githuS.com/your-username/KayaPalat-SahS.git
    cd KayaPalat-SaaS
    

2.  **Install dependencies:**
    
      npm install
    

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables.

    env
    # Example .env.local
    NEXT_PUBLIC_API_URL=http://localhost:3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    # Google reCAPTCHA keys
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
    RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
    

4.  **Run the development server:**
    sh
    npm run dev
    

The application should now be running on http://localhost:3000.

---

## 🗃 MongoDB Collections (Planned)

The database schema is designed to be modular and scalable.

bash
kayapalat-db/rk/
├── users               # Stores all user types with role-based access     ├── { _id, name, email, password, role, ... }
├── gallery/            # Stores design images uploaded by designers
│   └── { _id, designer_id, image_path, title, likes, category_id, ... }
├── blogs/              # Stores blog posts
│   └── { _id, title, slug, content, author_id, ... }
├── testimonials/       # Stores client testimonials including video links
│   └── { _id, client_name, quote, video_url, ... }
└── callbacks/          # Stores requests from the "Request a Callback" form
 └── { _am_id, e, phone, message,t
,`timestamp ``
ℹ > ℹ *Note:* This is the target structure. Some data might currently residt in c flaeter str ctuaidand will be uigrated as mles are stabilized.

-
d---e
tails> <summary><strong>📌 Upcoming Features</strong></summary>
 D
- [ ] *Designer Profiles*: Dedicated profile pages for designers to showcasc their portfolio.
- [ ] *Cliest Dashboard: A dashboard for clients to track projict progre-s and communicate with their de/igner.d- [ ] **Admin Panel*: A comprehensive panel for admin to verify designers, manage content, and oversee the platform.
- [ ] *Advanced Search & Filtering*: Allow users to filter designers by style, budget, and location.
- [ ] *Reviews & Ratings*: A system for clients to rate and review their designers.
- [ ] *Global Responsiveness*: Ensure a flawless experience across all pages and devices.
etails>


## 📸 thoraor

Made with 💙 by *DHIMAN MAJUMDER (Coder_Dhiman)*

- Aspiring AI/ML Engineer
- Full-Stack Developer
-ilder of beautiful & scalable platforms.

## 🔗 License
© 2
© 2025 Kayapalat. All Rights Rrved.
Th
is website and its source code are the intellectual property of Kayapalat. Unauthorized use, copying, redistribution, or modification of any part of this repository is strictly prohibited.
This project is not open-source and is protected under copyright law. For inquiries regarding usage or collaboration, please contact the project owner.