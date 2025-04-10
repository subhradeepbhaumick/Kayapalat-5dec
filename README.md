<h1 align="center">✨ Kayapalat ✨</h1>
<p align="center">
  A freelance platform to connect interior designers with clients.<br/>
  Full-stack | Scalable | Mobile-friendly | Built with ❤️
</p>

---

## 🚧 Project Status

> ✅ Authentication done  
> ✅ Homepage done  
> 📱 Mobile responsiveness in progress (per page as developed)  
> 🧱 Backend modular routes live  
> 💾 MongoDB restructure planned  
> 🛠️ Full site development underway

---

<details>
<summary><strong>🧠 Vision</strong></summary>

> “Kayapalat is more than a marketplace—it’s a transformation engine for the interior design space. We aim to empower designers with visibility and clients with trust.”

</details>

---

## 🚀 Tech Stack

| Layer        | Tech Used              |
|--------------|------------------------|
| 💻 Frontend  | Next.js + Tailwind CSS |
| 🔙 Backend   | FastAPI (Python)       |
| ☁️ Database | MongoDB Atlas          |
| 🔐 Auth      | JWT + bcrypt + Google reCAPTCHA |
| 📤 Media     | Edgestore (not yet)             |
| 📦 State     | Context API (or Next.js built-ins) |
| 🧪 Testing   | (Planned)              |
| 🚀 Deployment| (Planned: Vercel / Render) |

---

## ✅ Features So Far

- 🔒 **JWT-authenticated** Sign-in / Sign-up  
- 👥 Multi-role support: Customer, Designer, Partner, Refer & Earn  
- 🧠 Google reCAPTCHA integration  
- 🖼️ Profile picture uploads via **Edgestore**  
- 🧾 Secure password hashing  
- ⏳ Post-auth countdown redirection  
- 📞 Callback form with MongoDB storage  
- 🏠 Fully designed and responsive homepage  
- 📱 Mobile-first implementation in progress  

---

## 🧩 MongoDB Collections (as planned)

```bash
📦 kayapalat-db/
├── users/
│   ├── Customer
│   ├── Designer
│   ├── BusinessPartner
│   └── ReferAndEarn
├── gallery/
│   └── [designer_id]: [imageURL[]]
├── callback/
│   └── { name, phone, message }
```
ℹ️ Currently all data lives under users — will restructure once feature modules are stabilized.


<details> <summary><strong>📌 Upcoming Features</strong></summary>
 Designer profile page with image gallery
 Client dashboard with live project tracking
 Admin panel for designer verification
 Designer search & filter
 Review & rating system
 Global mobile-first responsiveness
</details>


📸 Screenshots (coming soon...)
Will add later.

🙌 Author
Made with 💙 by DHIMAN MAJUMDER (Coder_Dhiman)
Aspiring AI/ML Engineer | Full-stack dev | Builder of beautiful & scalable platforms.

🔗 License
© 2025 Kayapalat. All rights reserved.
This website and its source code are the intellectual property of Kayapalat. Unauthorized use, copying, redistribution, or modification of any part of this repository is strictly prohibited.
This project is not open-source and is protected under copyright law. For inquiries regarding usage or collaboration, please contact the project owner.



