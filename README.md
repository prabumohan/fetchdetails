# Network Details - What's My IP

A modern, beautiful website to display your network information including IP address, location, ISP, browser details, and more. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🌐 **IP Address Detection** - Shows your public IP address
- 📍 **Location Information** - City, region, country, and coordinates
- 🏢 **ISP Details** - Internet Service Provider and ASN information
- 🌍 **Browser & OS Info** - Detects your browser, operating system, and device type
- 🕐 **Timezone** - Your current timezone
- 📊 **Additional Headers** - User agent, language, encoding, and more
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ⚡ **Fast & Lightweight** - Built with Next.js for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages compatible

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Build for Cloudflare Pages

```bash
npm run build
npm run build:cf
```

## Deployment

### Deploy to Cloudflare Pages

1. Push your code to GitHub
2. In Cloudflare Pages dashboard:
   - **Build command**: `npm run build && npm run build:cf`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: (leave empty or set to project root)
3. Deploy!

### Deploy to Vercel (Alternative)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with default settings

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

## How It Works

The application uses:
- Next.js API routes to fetch network information
- Client-side headers to detect IP address (works with proxies)
- External IP geolocation service (ipapi.co) for location data
- User agent parsing for browser/OS detection

## Customization

- **IP Geolocation Service**: You can replace the IP geolocation service in `app/api/network-info/route.ts` with your preferred service (e.g., ip-api.com, ipgeolocation.io, etc.)
- **Styling**: Modify `tailwind.config.ts` and `app/globals.css` to customize the design
- **Features**: Add more network information by extending the API route

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
