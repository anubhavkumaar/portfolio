# 📚 Complete Deployment Guide

## ⚠️ Prerequisites

Before proceeding, ensure you have:

1. **Git** installed on your machine
   - Download from https://git-scm.com/download/win
   - During installation, choose "Use Git from the command line"

2. **Node.js** 18+ (for local development)
   - Download from https://nodejs.org/

3. **GitHub Account** 
   - Sign up at https://github.com

## 🚀 Step 1: Setup Your Project Locally

### 1.1 Install Dependencies

Open PowerShell/Command Prompt in this portfolio directory and run:

```bash
npm install
```

### 1.2 Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 to see your portfolio running locally.

### 1.3 Create Production Build

```bash
npm run build
```

This generates static files in the `out/` folder.

## 📤 Step 2: Push to GitHub

### 2.1 Initialize Git Repository

```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial portfolio setup"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `portfolio`
3. Make it **Public** (important for free hosting)
4. Add description: "My personal portfolio website"
5. Click "Create repository"

### 2.3 Connect & Push to GitHub

Replace `USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

You'll be prompted to authenticate:
- Use your GitHub username and personal access token (or password)
- Generate token: https://github.com/settings/tokens

✅ Your code is now on GitHub!

## 🌐 Step 3: Deploy to Infinity Free

### 3.1 Create Infinity Free Account

1. Visit https://app.infinityfree.net
2. Sign up with email
3. Create a new website
4. Choose a domain (e.g., `portfolio.infinityfreeapp.com`)
5. Complete the setup

### 3.2 Get FTP Credentials

After account creation:
1. Go to "Account Settings"
2. Find "FTP Details"
3. Note down:
   - FTP Server address
   - FTP Username
   - FTP Password

### 3.3 Deploy Option A: Manual Upload via File Manager

**Fastest way to get started:**

1. Build your project:
   ```bash
   npm run build
   ```

2. Go to Infinity Free → File Manager

3. Navigate to `public_html/`

4. Delete everything in `public_html/`

5. Upload all files from `out/` folder:
   - Upload directly via their web interface
   - Or use their FTP uploader

6. Visit your domain to see it live! 🎉

### 3.4 Deploy Option B: Automatic Deployment with GitHub Actions

**For continuous deployment on every push:**

1. Go to your GitHub repository

2. Navigate to **Settings → Secrets and variables → Actions**

3. Click "New repository secret" and add:

   **Secret 1:**
   - Name: `FTP_SERVER`
   - Value: Your Infinity Free FTP server address

   **Secret 2:**
   - Name: `FTP_USERNAME`
   - Value: Your Infinity Free FTP username

   **Secret 3:**
   - Name: `FTP_PASSWORD`
   - Value: Your Infinity Free FTP password

4. The `.github/workflows/deploy.yml` file is already in your repo

5. Make a test push:
   ```bash
   git add README.md
   git commit -m "Test GitHub Actions deployment"
   git push
   ```

6. Watch the deployment:
   - Go to GitHub repo → "Actions" tab
   - Click the running workflow
   - Wait for completion (green checkmark = success)

Now every time you push code to `main` branch, it automatically deploys! 🚀

## 🔧 Step 4: Setup Custom Domain (Optional)

### 4.1 Come by a Domain

1. Registrar options:
   - Namecheap ($0.88 first year)
   - GoDaddy
   - Domain.com

### 4.2 Add to Infinity Free

1. In Infinity Free account → Dashboard
2. Click your website
3. Click "Manage Domain"
4. Select "Parked Domain" or "Custom Domain"
5. Point nameservers to Infinity Free's nameservers
6. Wait 24-48 hours for DNS propagation

## 📋 Verification Checklist

- [ ] Project builds successfully locally (`npm run build`)
- [ ] Code is pushed to GitHub
- [ ] Files are visible at your Infinity Free domain
- [ ] Portfolio loads correctly in browser
- [ ] All links and images work
- [ ] Light/dark mode toggle works
- [ ] Mobile view looks good

## 🆘 Troubleshooting

### Issue: GitHub Actions fails
**Solution:** 
- Check FTP credentials are correct
- Ensure no special characters in FTP password that need escaping
- Try manual upload first

### Issue: Files not appearing on Infinity Free
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Wait a few minutes for file transfer
- Make sure you uploaded from `out/` folder, not root

### Issue: Images not loading
**Solution:**
- All images use external URLs (vgy.me, icons8, etc.)
- Check your internet connection
- If external images blocked, download and upload locally

### Issue: Styles not applied
**Solution:**
- Build was successful: `npm run build`
- Uploaded entire `out/` folder contents
- Check for .css files in Infinity Free file manager

## 📝 Next Steps

After deployment:

1. **Update Content**
   - Edit `app/page.tsx` with your actual information
   - Replace images with your own
   - Update social links

2. **Custom Domain**
   - Set up your own domain (optional but recommended)

3. **SEO Optimization**
   - Update metadata in `app/layout.tsx`
   - Submit sitemap to Google Search Console

4. **Analytics** (Optional)
   - Add Google Analytics
   - Track visitor engagement

## 🎯 Summary

Your deployment journey:
1. ✅ Code is ready in `portfolio/` folder
2. → Install dependencies: `npm install`
3. → Build: `npm run build`
4. → Push to GitHub
5. → Deploy to Infinity Free (manual or automated)
6. → Visit your live portfolio! 🎉

---

**Questions?** Check:
- GitHub Issues: https://github.com/anubhavkumaar/portfolio/issues
- Infinity Free Help: https://community.infinityfree.net/
- Portfolio GitHub: https://github.com/anubhavkumaar/portfolio

Good luck! 🚀
