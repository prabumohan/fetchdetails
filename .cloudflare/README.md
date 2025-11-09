# Cloudflare Pages Configuration

## Required Settings

In your Cloudflare Pages dashboard, configure the following:

### Build Settings:
- **Build command**: `npm run build:cf`
- **Build output directory**: `.vercel/output/static`
- **Deploy command**: (leave EMPTY - Cloudflare Pages deploys automatically)

### Important Notes:
- Do NOT set a deploy command - Cloudflare Pages handles deployment automatically
- The `build:cf` script runs both Next.js build and the Cloudflare Pages adapter
- The output directory `.vercel/output/static` is where the adapter places the files

