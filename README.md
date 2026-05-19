# Assistant Constitutionnel — République Démocratique du Congo

An AI assistant covering 10 constitutional texts of the DRC (1908–2011), built with Next.js and Claude.

## Features

- 🇨🇩 Full DRC flag landing page
- 📄 10 constitutional documents loaded directly from presidence.cd
- 🔍 Article-level citations in every answer
- 💬 Streaming responses via Server-Sent Events
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔒 API key stored server-side — never exposed to the browser

## Documents covered

| Document | Year |
|---|---|
| Révision constitutionnelle (Loi N°11/002) | 2011 |
| Constitution de la 3ème République | 2006 |
| Constitution de la Transition | 2003 |
| Accord Global et Inclusif | 2002 |
| Constitution de la Transition | 1992 |
| Constitution de la 2ème République | 1967 |
| Constitution de Luluabourg | 1964 |
| Loi fondamentale | 17 Juin 1960 |
| Loi fondamentale | 19 Mai 1960 |
| Charte Coloniale | 1908 |

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/rdc-constitution.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add environment variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com)
4. Click **Deploy**

That's it — Vercel handles everything else automatically.

## Local development

```bash
# Install dependencies
npm install

# Add your API key
cp .env.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Anthropic Claude (claude-sonnet-4-5) with streaming
- **PDF parsing:** pdfjs-dist (server-side, no CORS issues)
- **Styling:** CSS custom properties (no framework dependency)
- **Deployment:** Vercel (zero config)
