# Graphoria — Creative Design Studio Platform

Graphoria is a modern digital design studio platform built to showcase high-quality creative work, manage client inquiries, and deliver a seamless brand experience.

This platform combines a visually rich frontend with a dynamic Supabase-powered backend, enabling real-time content updates, structured project management, and automated notifications.

---

## 🚀 Live Overview

Graphoria is designed to:

* Showcase branding, packaging, posters, and UI/UX work
* Provide a premium portfolio browsing experience
* Handle client inquiries with real-time notifications
* Enable admin-level content management without code changes

---

## 🧩 Core Features

### 🎨 Dynamic Portfolio System

* Fully dynamic project data (no static content)
* Category-based filtering (Branding, Packaging, Posters, UI Design)
* Detailed project pages with structured content

### 🧠 Admin Panel

* Add / update / delete projects
* Manage homepage swiper content
* View client inquiries and system logs

### 📩 Contact & Notification System

* Contact form integrated with Supabase
* Real-time storage in database
* Automated email notifications via Edge Functions

### 🛠 Error Monitoring System

* Global frontend error tracking
* API & database error logging
* Centralized admin notification panel

### ⚡ Performance & UX

* Responsive across all devices
* Smooth UI transitions and interactions
* Optimized image and layout rendering

---

## 🏗 Tech Stack

### Frontend

* React / TypeScript
* Tailwind CSS
* Component-based architecture

### Backend (Serverless)

* Supabase (PostgreSQL + Auth + Storage)
* Supabase Edge Functions

### Email & Notifications

* Brevo (Transactional Email API)

### Deployment

* Frontend: (Vercel / Netlify)
* Backend: Supabase Cloud

---

## 📂 Project Structure

```
/src
  /components
  /pages
  /hooks
  /services
/supabase
  /functions
```

---

## 🔐 Security & Data Handling

* Row Level Security (RLS) enabled in Supabase
* Public insert access restricted to required tables only
* Admin-only read access for sensitive data
* Environment variables secured via Supabase secrets

---

## ⚙️ Environment Setup

Create a `.env` file:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

---

## 📬 Email Notification Flow

User Action → Supabase Insert → Trigger → Edge Function → Email Sent

* Contact form submissions trigger email alerts
* System errors are logged and notified automatically

---

## 🎯 Vision

Graphoria aims to bridge creativity and technology by building scalable digital experiences that help brands stand out in competitive markets.

---

## 📌 Future Enhancements

* Role-based admin access
* Analytics dashboard
* Project performance tracking
* Client authentication portal

---

## 👤 Author

Pavitthiran
Full Stack Developer — Graphoria

---

## 📄 License

MIT License
