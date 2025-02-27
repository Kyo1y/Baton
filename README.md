# 🎵 Music Transfer Bot (Spotify ↔ YouTube Music)

This Telegram bot allows users to transfer playlists between **Spotify** and **YouTube Music** using **Firebase** for authentication and data storage.

---

## 📌 Features
✅ Transfer playlists from **Spotify to YouTube Music**  
🚧 **YouTube to Spotify transfer is currently under development** (see [Known Issues](#-known-issues))
✅ Secure authentication using Firebase  
✅ Uses **Flask** for backend handling  

---

## 🛑 Known Issues

### ❌ YouTube to Spotify Transfer Currently Unavailable
Currently, **transferring playlists from YouTube to Spotify is not working** due to YouTube’s complex data storage structure. Unlike Spotify, which provides structured metadata access via its API, YouTube does not expose a standardized way to extract song metadata reliably.

### 🔧 Solution in Development
I am actively working on a solution utilizing **one of the major AI language models** (e.g., **ChatGPT, Claude, etc.**) to process YouTube song metadata, and match it with Spotify's catalog.

The goal is to:
✅ Extract song titles and artist names from YouTube videos  
✅ Use AI models to match them with Spotify’s database  
✅ Improve accuracy and minimize mismatches  

Stay tuned for updates on this feature! 🚀

---

## 🚀 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Kyo1y/MusicExp.git
cd your-repo