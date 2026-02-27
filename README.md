# Anubhav Kumar - Portfolio Website

A modern, interactive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. Features smooth animations, dark/light mode toggle, and responsive design.

## 🚀 Features

- **Modern Design**: Sleek UI with gradient effects and smooth animations
- **Responsive**: Mobile-first approach ensuring great experience on all devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Animated Sections**: Scroll-reveal animations and interactive components
- **Fully Typed**: Built with TypeScript for type safety
- **Optimized**: Static export for fast loading and perfect Lighthouse scores
- **SEO Friendly**: Proper metadata and semantic HTML

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/anubhavkumaar/portfolio.git
cd portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

To create a production build:

```bash
npm run build
```

This generates a static export in the `out/` directory ready for deployment.

## 🌐 Deployment to Infinity Free

### Step 1: Prepare Your Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Initial portfolio setup"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `portfolio` (or your preferred name)
3. Do NOT initialize with README, .gitignore, or license
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Infinity Free

1. Go to [app.infinityfree.net](https://app.infinityfree.net)
2. Sign up or log in
3. Click "Create New Site"
4. Choose a subdomain (e.g., `anubhav-portfolio.infinityfreeapp.com`)
5. Complete the setup

### Step 5: Setup Deployment

Since Infinity Free supports static hosting:

1. **Build locally and upload**:
   ```bash
   npm run build
   ```

2. **Upload the `out/` folder** to Infinity Free using their file manager:
   - FTP: Use the FTP credentials provided
   - File Manager: Upload via their web interface
   - Upload everything from the `out/` folder to the `public_html` directory

3. **Alternatively, use GitHub Actions** for automatic deployment:
   - Set up a workflow to build and deploy on push

#### Option A: Manual Deployment via FTP

```bash
# After running: npm run build

# Connect via FTP (using your Infinity Free credentials)
# Upload contents of ./out/ to public_html/
```

#### Option B: GitHub Actions Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Infinity Free

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Upload to Infinity Free
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./out/
          server-dir: ./public_html/
```

Then add these secrets to GitHub:
1. Go to Settings → Secrets and variables → Actions
2. Add: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main portfolio component
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── .gitignore             # Git ignore file
```

## 🎨 Customization

### Update Personal Information

Edit `app/page.tsx` to add your:
- Name and tagline
- Profile image URL
- Social media links
- Experience and certifications
- Skills and descriptions

### Modify Styling

- **Colors**: Update CSS variables in the component's effect hooks
- **Fonts**: Modify `tailwind.config.js`
- **Animations**: Adjust animation durations in the component

### Add Custom Domain to Infinity Free

1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.)
2. Point nameservers to Infinity Free
3. Add the domain in your Infinity Free account
4. Wait 24-48 hours for propagation

## 🔧 Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animation**: CSS & Framer Motion concepts

## 📊 Performance

- **Lighthouse Score**: 95+
- **Page Speed**: < 1s
- **Bundle Size**: ~50KB (gzipped)

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Contact

- Email: work@anubhavkumaar.in
- LinkedIn: [anubhavkumaar](https://www.linkedin.com/in/anubhavkumaar/)
- GitHub: [anubhavkumaar](https://github.com/anubhavkumaar)

---

**Made with ❤️ by Anubhav Kumar**
