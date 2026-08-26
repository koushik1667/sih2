# 🌱 AgriSphere AI — Unified Agricultural Intelligence & Cloud SRM

AgriSphere AI is an integrated agricultural technology platform designed for Indian agronomy. It unifies **GeoSR-AI Sub-Meter Satellite Super-Resolution Mapping (2.5m)**, **ICAR Soil Precision Health Cards & Fertilizer Optimization**, and the **Krishi Mitra AI Agronomist** with isolated Cloud Firestore persistence.

---

## 🚀 One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Step-by-Step Vercel Deployment via Git

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AgriSphere AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agrisphere-ai.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your Git repository and click **Import**.
   - Vercel automatically detects the project using `vercel.json` and Vite configuration.

3. **Set Environment Variables in Vercel**:
   In your Vercel Project Dashboard (**Settings** > **Environment Variables**), add:

   | Variable | Description | Required |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | Google Gemini API Key for Krishi Mitra AI | Yes |
   | `VITE_FIREBASE_API_KEY` | Firebase Web API Key | Optional (defaults provided) |
   | `VITE_FIREBASE_PROJECT_ID`| Firebase Project ID | Optional (defaults provided) |
   | `VITE_FIREBASE_AUTH_DOMAIN`| Firebase Auth Domain | Optional (defaults provided) |
   | `FIREBASE_PROJECT_ID` | Server-side Firebase Project ID | Optional |
   | `FIREBASE_CLIENT_EMAIL` | Firebase Admin Service Account Email | Optional |
   | `FIREBASE_PRIVATE_KEY` | Firebase Admin Private Key | Optional |

4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend assets into `dist/` and configure the serverless API routes under `/api`.

---

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up `.env`**:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📦 Project Architecture

- **`src/`**: Modern React 19 + Tailwind CSS frontend with interactive maps, multi-spectral layer sliders, radar weather timeline, and responsive UI.
- **`server.ts` & `api/index.ts`**: Express backend providing REST endpoints for GeoSR-AI super-resolution simulations, ICAR soil scoring, IMD weather radar, and Gemini AI. Configured for both standalone Node servers and Vercel Serverless Functions.
- **`vercel.json`**: Pre-configured Vercel configuration routing `/api/*` to the serverless function and all page routes to SPA `index.html`.
- **`firebase-applet-config.json` & `firestore.rules`**: Firebase Authentication and Firestore security rules.
