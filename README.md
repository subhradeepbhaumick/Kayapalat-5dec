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
| 📤 Media     | Edgestore              |
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
