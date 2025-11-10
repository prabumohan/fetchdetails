# IP Address Checker

A simple web page that displays your IP address. Built for Cloudflare Pages.

## Features

- Shows your current IP address
- Clean, modern UI
- Works perfectly on Cloudflare Pages
- No build process required

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:8788 in your browser

## Deployment to Cloudflare Pages

1. Push your code to GitHub
2. Go to Cloudflare Pages dashboard
3. Connect your repository
4. Build settings:
   - **Build command**: Leave empty (no build needed)
   - **Build output directory**: Leave empty or set to `/`
5. Deploy!

That's it! Cloudflare Pages will automatically detect the `functions/` directory and serve your API endpoint.

## How It Works

- `index.html` - The main page that displays the IP address
- `functions/api/ip.js` - Cloudflare Pages Function that extracts and returns the IP address from request headers

## License

MIT License - feel free to use this project for your own purposes!
