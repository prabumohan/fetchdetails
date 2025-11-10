# Cloudflare Pages Configuration

## Required Settings

In your Cloudflare Pages dashboard, configure the following:

### Build Settings:
- **Build command**: `npm run build:cf`
- **Build output directory**: `.vercel/output` (NOT `.vercel/output/static`)
- **Deploy command**: `npm run deploy:cf` (or leave EMPTY - Cloudflare Pages deploys automatically)

### Important Notes:
- The `build:cf` script runs both Next.js build and the Cloudflare Pages adapter
- The output directory `.vercel/output` contains both static files and functions
- Cloudflare Pages needs the parent directory (`.vercel/output`) not just the static subdirectory

