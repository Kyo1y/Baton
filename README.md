# 🎵 Music Transfer Bot (Spotify ↔ YouTube Music)

This Telegram bot allows users to transfer playlists between **Spotify** and **YouTube Music** using **Firebase** for authentication and data storage.

Search @TransferMusic_bot on Telegram to try it out!

---

## 📌 Features
✅ Transfer playlists from **Spotify to YouTube Music** and  from **YouTube Music to Spotify**
✅ Secure authentication using Firebase  
✅ Uses **Flask** for backend handling  

---

## 🛑 Known Issues

### ❌ YouTube to Spotify Transfer Currently Unavailable
Telegram Inline Buttons: callback queries aren’t acknowledged, so the client spinner never clears and users must click each button multiple times.

### 🔧 Solution in Development
Add await query.answer() at the start of every callback handler to immediately clear the Telegram inline‑button spinner, and refactor the choice handler to invoke the correct auth step directly for a true one‑click flow.

---

## ⚠️ Important Security Notice
This project uses API keys and credentials that **must not** be exposed. Before running, create a `.env` file following `.env.example` and add your API keys.

---

## 🚀 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Kyo1y/MusicExp.git
cd your-repo
