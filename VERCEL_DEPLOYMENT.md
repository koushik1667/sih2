# 🚀 Vercel Git Deployment Guide for AgriSphere AI

This guide explains how to deploy AgriSphere AI to **Vercel** directly from your Git repository (GitHub, GitLab, or Bitbucket).

---

## 1. Prerequisites
- A free [Vercel](https://vercel.com) account.
- A free [GitHub](https://github.com) account (or GitLab/Bitbucket).
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey).

---

## 2. Git Repository Setup

If you haven't pushed the project to GitHub yet, run these commands in your project terminal:

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: AgriSphere AI ready for Vercel deployment"

# 4. Set default branch to main
git branch -M main

# 5. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/agrisphere-ai.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 3. Importing into Vercel

1. Log into your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** → **"Project"**.
3. Under **"Import Git Repository"**, select your `agrisphere-ai` repository and click **Import**.
4. Vercel will automatically read `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Root Directory**: `./` (leave default)

---

## 4. Environment Variables Configuration

Before clicking **Deploy**, expand the **"Environment Variables"** section in the Vercel import page and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Gemini API Key from Google AI Studio |
| `VITE_FIREBASE_API_KEY` | *(Optional)* | Custom Firebase Web API Key if not using default config |
| `VITE_FIREBASE_PROJECT_ID` | *(Optional)* | Custom Firebase Project ID |
| `FIREBASE_PROJECT_ID` | *(Optional)* | Firebase Admin Project ID |
| `FIREBASE_CLIENT_EMAIL` | *(Optional)* | Firebase Admin Service Account Email |
| `FIREBASE_PRIVATE_KEY` | *(Optional)* | Firebase Admin Service Account Private Key |

*(Note: If you don't provide custom Firebase environment variables, the application gracefully loads the built-in configuration from `firebase-applet-config.json`)*.

---

## 5. Automatic CI/CD Deployments

Every time you push a commit to your `main` branch on GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```
Vercel will automatically trigger a new deployment preview and update your live production URL within seconds!

---

## 6. Verification Checklist

After the deployment finishes:
- [x] **Home & Login Page**: Verify the public home page and login dashboard load with smooth animations.
- [x] **API Health**: Visit `https://your-vercel-domain.vercel.app/api/health` to confirm the serverless function responds with `{ status: "ok" }`.
- [x] **Soil & Satellite Tools**: Run a soil test and satellite super-resolution analysis to confirm all client-side and serverless endpoints are communicating properly.
