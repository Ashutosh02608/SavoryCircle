# 🍳 SavoryCircle

SavoryCircle is a premium, state-of-the-art recipe catalog and culinary community platform. Built for passionate home cooks and professional chefs alike, the application offers culinary discovery, interactive step-by-step recipe guides, interactive review/rating systems, immersive creator stories, and profile bookmarking dashboards.

---

## ✨ Features

- **🍔 Culinary Catalog Explorer**: Browse, search, filter, and sort recipes dynamically by title, category, author, or description.
- **📊 Smart Catalog Sorting**: Toggle recipe displays instantly based on **Newest** (creation date), **Highest Rated** (average rating score), or **Prep Time** (duration ascending).
- **🍕 Interactive Recipe Dashboard**:
  - Scale ingredient quantities dynamically based on custom serving sizes.
  - Track recipe progress with an interactive step check-off system and completion percentage bar.
  - View full nutritional breakdowns per serving against Daily Value (DV) percentages.
  - Smoothly scroll to the review form with a "Rate this recipe" shortcut link.
- **📖 Immersive Creator Stories**: Read featured cooking blogs and chef stories inside a full-screen image/text slider featuring autoplay, pause controls, and progress indicators.
- **👨‍🍳 Chef & Creator Hub**: Check out creator profiles, deep-dive into their signature dishes, and follow/unfollow creators with real-time follower stats updates.
- **✍️ Recipe Creation & Publishing**: Create and publish custom recipes to Firestore with ingredients, directions, timers, nutritional details, difficulty levels, and photo URLs.
- **🔒 Secure Authentication**: Login, sign up, set up custom display profiles, and request password resets using Firebase Authentication.
- **📂 Personal Dashboard & Saved Recipes**: Track your personal culinary dashboard complete with stats (bookmarks, published recipes) and browse your saved recipes quickly via URL-synced tab navigation.
- **🎨 Design System**: Premium dark-mode ready glassmorphic interfaces built using TailwindCSS, custom UI components, and Framer Motion micro-animations.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js (App Router)](https://nextjs.org/)
* **Database & Auth**: [Firebase Firestore & Firebase Authentication](https://firebase.google.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Styling**: [TailwindCSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Ashutosh02608/SavoryCircle.git
cd SavoryCircle
npm install
```

### 3. Firebase Configuration
Create a `.env.local` file in the root directory and add your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running the Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Running Production Builds
Build and export optimized static assets:
```bash
npm run build
npm run start
```

---

## 📂 Directory Structure

```text
├── app/                  # Next.js App Router pages
│   ├── add-recipe/       # Recipe creation form page
│   ├── categories/       # Category browse cards
│   ├── creators/         # Chef directories and follows
│   ├── login/            # Sign in and authentication forms
│   ├── profile/          # User dashboards and bookmarked items
│   ├── recipes/          # Catalog explorer & details dynamic pages
│   ├── signup/           # Account registration forms
│   └── stories/          # Immersive sliders & chef logs
├── components/           # Reusable UI component modules
│   └── ui/               # Base buttons, sliders, tab navigation, floating navbars
├── lib/                  # Shared utilities and global constant configs
│   ├── constants.js      # Static navigation links, categorizations and mock data
│   └── firebase.js       # Firebase initialization client setup
└── public/               # Static image assets and icons
```
