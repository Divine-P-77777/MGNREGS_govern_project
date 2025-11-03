# 🧭 Mitra — Empowering Bharat through Data & Voice

**Mitra** is a modern web application built to bring **transparency and accessibility** through **voice and data-driven insights**.  
It leverages **Next.js (TypeScript)**, **Framer Motion**, **MongoDB**, **OpenCage API**, and **Web Speech API** — wrapped in a **PWA** for a seamless experience across all devices.

---

## 🚀 Tech Stack

| Layer | Technology |
| :-- | :-- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (TypeScript) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| **APIs** | [OpenCage](https://opencagedata.com/), [Data.gov](https://data.gov.in/), [LocationIQ](https://locationiq.com/) |
| **Voice Engine** | Web Speech API |
| **PWA** | Offline-first Progressive Web App |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Divine-77777/mitra.git
cd mitra
```


## 2️⃣ Install Dependencies

```
npm install
```

3️⃣ Configure Environment Variables

Create two files in the project root:

.env

```
MONGODB_URI=***************************
DATA_GOV_API_KEY=***********************
OPENCAGE_API_KEY=************************
```


.env.local

```
NEXT_PUBLIC_LOCATIONIQ_API_KEY=*************
```

## 4️⃣ Run the Development Server

```
npm run dev
```


App runs at: 👉 http://localhost:3000




## 5️⃣ Build for Production

```
npm run build
npm start
```



## 📱 Key Features

✅ Voice-based intro using Web Speech API

✅ Smart district detection via OpenCage API

✅ MongoDB caching for faster repeat lookups

✅ Smooth interactive UI powered by Framer Motion

✅ PWA support — offline-first experience

✅ Data visualization with Recharts

## 🧰 Development Notes

Built with Next.js 16, React 19, TypeScript 5

Uses Turbopack for ultra-fast builds

Compatible with Node.js ≥ 20



## 👨‍💻 Author

Deepak Prasad

## “Empowering Bharat through Data & Voice — one insight at a time.”