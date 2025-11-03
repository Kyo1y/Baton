# 🎵 Music Transfer Bot (Spotify ↔ YouTube Music)

This Web App/Telegram bot allows users to transfer playlists between **Spotify** and **YouTube Music**.

Search @TransferMusic_bot on Telegram to try it out!
Web App is still under development ⏳

---

## 📌 Features
✅ Transfer playlists from **Spotify to YouTube Music** and from **YouTube Music to Spotify**
✅ Create new playlists on transfer
✅ Secure OAuth (PKCE) for Spotify and YouTube (tokens stored in DB)
✅ Transfer history

---
## 🧰 Tech Stack

Frontend: Next.js (App Router) + TypeScript, Tailwind + shadcn/ui, Flask

Auth: NextAuth (Google/GitHub), server-side guards with getServerSession

DB: Postgres (Docker), Prisma ORM, Firebase Real-time Database

Caching: unstable_cache + revalidateTag

APIs: Spotify Web API, YouTube Data API v3, OpenAI API, Telegram API

---

## ⚠️ Important Security Notice
This project uses API keys and credentials that **must not** be exposed. Before running, create a `.env` file following `.env.example` and add your API keys.

---

## 🚀 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Kyo1y/MusicExp.git
cd your-repo
