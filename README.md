# 🌸 AI Wellness Companion

An AI-powered wellness application built with React, TypeScript, Express, and Generative AI.

The application helps users improve mindfulness, self-reflection, and emotional well-being through personalized affirmations, AI-powered journaling, reflection prompts, daily themes, and progress tracking.

---

# ✨ Features

## 🤖 AI Affirmations

Generate personalized affirmations based on your mood.

Examples:

* Anxiety
* Stress
* Self Love
* Motivation
* Gratitude
* Custom emotions

The AI generates calming and encouraging affirmations tailored to the user's emotional state.

---

## 📔 AI Journal Reflection

Users can write freely about their day.

The AI analyzes the journal entry and provides:

### 🌸 Reflection

A thoughtful interpretation of the user's thoughts and emotions.

### 💭 Reflection Question

A follow-up question designed to encourage deeper self-awareness.

### 🌱 Tiny Action

A small actionable step users can take immediately.

---

## ❤️ Favorites

Save meaningful affirmations for future reference.

Features:

* Add affirmations to favorites
* Duplicate prevention
* Persistent storage using Local Storage
* Remove favorites individually

---

## 🔊 Read Aloud

Built-in speech synthesis.

Users can listen to affirmations instead of reading them.

Useful for:

* Morning routines
* Meditation sessions
* Relaxation breaks
* Accessibility support

---

## 📋 Copy Feature

Quickly copy:

* Affirmations
* Journal reflections
* Journal history entries

and share them anywhere.

---

## 🕒 Journal History

View all previous journal entries.

Features:

* Chronological history
* Reflection review
* Copy entries
* Delete individual entries
* Clear all history

---

## 🔥 Streak Tracking

Track consistency and journaling habits.

Metrics:

* Current streak
* Best streak
* Total journal entries

Designed to encourage healthy reflection habits.

---

## 🌅 Daily Themes

The application displays a calming visual theme that remains consistent throughout the day.

Themes include:

* Ocean
* Forest
* Clouds
* Mountains
* Sunrise
* Lavender

Users can manually switch themes if desired.

---

## ⏰ Hourly Affirmations

Optional hourly reminders that provide gentle encouragement throughout the day.

Features:

* Pop-up affirmations
* Save to favorites
* Read aloud
* Persistent user preference

---

## 📱 Progressive Web App (PWA)

Installable on:

* iPhone
* Android
* Chrome
* Edge

Provides an app-like experience directly from the browser.

---

# 🏗️ Architecture

```text
Frontend (React + TypeScript)
            │
            ▼
      Express Backend
            │
            ▼
      Generative AI API
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* CSS

## Backend

* Node.js
* Express
* TypeScript

## AI

* Gemini API

## Browser APIs

* Local Storage
* Speech Synthesis
* Clipboard API
* Service Workers

---

# 📂 Project Structure

```text
ai-wellness-companion
│
├── public
│   ├── manifest.webmanifest
│   ├── sw.js
│
├── server
│   ├── index.ts
│   ├── package.json
│
├── src
│   ├── components
│   │   └── StreakCard.tsx
│   │
│   ├── pages
│   │   ├── AffirmationPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── JournalPage.tsx
│   │   └── JournalHistoryPage.tsx
│   │
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
│
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/alishaPr/GEN-AI.git
```

```bash
cd GEN-AI
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd server
npm install
```

---

# 🔐 Environment Variables

Create:

```text
server/.env
```

Example:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

---

# ▶️ Run Backend

```bash
cd server
npm run dev
```

Backend:

```text
https://ai-wellness-backend-q0ui.onrender.com
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 📱 PWA Installation

## iPhone

Safari

→ Open app

→ Share

→ Add to Home Screen

---

## Android

Chrome

→ Open app

→ Install App

---

# 💡 Future Enhancements

* User authentication
* Cloud database storage
* Mood analytics dashboard
* Push notifications
* AI wellness coach
* Multi-device sync
* Dark and light modes
* Meditation recommendations

---

# 🎯 Key Learnings

This project demonstrates:

* React application architecture
* State management
* API integration
* Generative AI integration
* Browser APIs
* Progressive Web Apps
* Local persistence
* Responsive UI design

---

# 👩‍💻 Author

Alisha Priyadarshini

Senior Data Engineer

Built as a hands-on Generative AI project to explore AI-powered user experiences, frontend development, and full-stack application design.
