# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 restaurant catalog application designed as a Telegram Mini App (TMA). It displays restaurants from St. Petersburg, Russia, with filtering, search, and detail pages. The app is optimized for mobile viewing and integrates with the Telegram WebApp API. The project is deployed on GitHub Pages with static export.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build for GitHub Pages
npm run build

# Run linter
npm run lint
```

## Tech Stack

- Next.js 15.5.2 with App Router
- React 19.1.0
- Tailwind CSS 4 (with new @import syntax)
- TypeScript 5
- Telegram WebApp SDK (loaded via CDN)
- GitHub Pages deployment with static export

## Deployment Configuration

**GitHub Pages Setup:**
- Repository: `piter-catalog-tma`
- Base path: `/piter-catalog-tma` (configured in next.config.ts)
- Static export: `output: 'export'`
- All asset paths must include BASE_PATH prefix

**Important Path Configuration:**
```javascript
const BASE_PATH = '/piter-catalog-tma';

// CSV loading
fetch(`${BASE_PATH}/database_enriched.csv`)

// Image paths
photo_path.push(`${BASE_PATH}/posts/${photoPath}`)

// Logo
<img src={`${BASE_PATH}/vp-logo.jpg`} />
```

After build, create `.nojekyll` file in `out/` directory to prevent GitHub Pages from ignoring files starting with underscore.

## Architecture

### Data Management

Restaurant data is loaded dynamically from a CSV file using a **hybrid architecture** that enables dynamic updates without rebuilding:

**Loading Strategy:**
- `app/restaurant/[id]/page.jsx` - Server component with `generateStaticParams()` for SSG
- `app/restaurant/[id]/RestaurantClientWrapper.jsx` - Client component that loads fresh data from CSV
- Main page loads all restaurants client-side via `loadRestaurants()`

**Why This Works:**
- Static HTML pages are pre-generated for all restaurants (faster initial load)
- Client-side components fetch CSV data on page load (always fresh data)
- When CSV is updated in GitHub repo, users see changes immediately upon page refresh
- No rebuild needed when adding/updating restaurants

**CSV Structure:**
- Headers include: id, telegram_link, text_html, link_1 (2GIS), link_2 (restaurant site), photo_path_1 through photo_path_10, hashtag_1 through hashtag_6, title_2gis, rating_2gis, average_check_2gis
- Restaurant data is parsed and transformed into objects with arrays for photos and hashtags
- Photos are automatically prefixed with `${BASE_PATH}/posts/` during parsing
- Average check values are cleaned (removing currency symbols) and converted to integers

**Data Transformation:**
During CSV parsing, the following transformations occur:
- Multiple `photo_path_1` through `photo_path_10` columns → single `photo_path` array
- Multiple `hashtag_1` through `hashtag_6` columns → single `hashtags` array
- `link_1` → `twogis_link` (2GIS map link)
- `link_2` → `restaurant_link` (restaurant website)
- HTML content in `text_html` is stripped to plain text and truncated to 2 sentences for `text_summary`
- Empty/whitespace-only values are filtered out from arrays
- All photo paths automatically receive `${BASE_PATH}/posts/` prefix

**Data Files:**
- `app/utils/csvParser.js` - Custom CSV parser with support for quoted fields and proper escaping
- `app/data/restaurants.js` - Contains `loadRestaurants(limit)` function that fetches and parses the CSV
- `app/data/categories.js` - Category definitions with emojis (cuisine types and venue types)
- `app/data/metroStations.js` - Set of metro station hashtags for filtering

### Component Structure

**Pages:**
- `app/page.js` - Main catalog page with client-side filtering, search, and numeric pagination
- `app/restaurant/[id]/page.jsx` - Server component wrapper for restaurant detail page (SSG)
- `app/restaurant/[id]/RestaurantClientWrapper.jsx` - Client component for restaurant detail page with dynamic data loading

**UI Components:**
- `Badge.jsx` - Reusable badge component with variants (default, secondary, outline)
- `Button.jsx` - Reusable button component with variants (default, outline)
- `SearchBar.jsx` - Search input with auto-suggestions (shows top 5 matches for 2+ characters)
- `CategoryFilter.jsx` - Horizontal scrolling category pills
- `RestaurantCard.jsx` - Restaurant preview card with tags, rating, and average check

### Restaurant Detail Page Features

**Image Slider:**
- Navigation arrows (left/right)
- Dot indicators for current image
- Image counter (e.g., "3 / 5")
- Aspect ratio 3:4, max height 600px
- Clickable dots to jump to specific image

**Tag System (Case-Insensitive Matching):**
- **Metro Tags Block** - Displays metro station hashtags with location icon and outline badge style
- **Cuisine Tags Block** - Displays category hashtags with utensils icon and secondary badge style
- Tags are filtered by comparing lowercase versions against `metroStations` and `categories` sets

**Description Section:**
- Shows first two sentences from `text_summary`
- If full `text_html` is longer than 500 characters, displays inline link "Читать полностью" to Telegram post
- Link styled with accent color (#EC5E54) without underline

**Fixed Bottom Buttons:**
- **2GIS Button** - Opens restaurant location in 2GIS app (uses `twogis_link` from CSV link_1)
- **Website Button** - Opens restaurant website (uses `restaurant_link` from CSV link_2)
- Both buttons remain visible during scroll
- Primary button with white text (#EC5E54 background), secondary button with outline style

### Key Patterns

**Client-Side Rendering:** Both main page and restaurant detail wrapper use `"use client"` directive with React hooks (useState, useMemo, useEffect) for filtering and data loading logic.

**Filtering Logic:**
- Category filter works via hashtag matching
- Search filter matches against `title_2gis` (case-insensitive)
- Both filters work together (AND logic)
- Numeric pagination with 10 items per page

**Pagination Display:**
- Shows max 2 page numbers between ellipses on middle pages (e.g., `1 ... 4 5 ... 25`)
- First 2 pages: `1 2 3 ... 25`
- Last 2 pages: `1 ... 23 24 25`
- Previous/Next buttons show only arrows (no text)

**Telegram Integration:**
- Telegram WebApp SDK loaded in `layout.js` via Next.js Script component
- `window.Telegram.WebApp.ready()` and `window.Telegram.WebApp.expand()` called on mount
- Layout constrained to mobile viewport (max-width: 480px) centered on desktop

**Path Aliases:**
- Uses `@/*` to reference root directory files (configured in tsconfig.json)
- Example: `import { loadRestaurants } from '@/app/data/restaurants'`

**Image Handling:**
- Photos stored locally in `/public/posts/` directory
- Image paths stored as arrays in restaurant data with `${BASE_PATH}/posts/` prefix
- Image slider component handles multiple photos per restaurant

### Styling

**Tailwind CSS v4:**
```css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat Alternates', sans-serif;
}
```

**Color Scheme:**
- Primary accent: `#EC5E54` (red)
- Text: `gray-900` (headings), `gray-600` (body text)
- Backgrounds: white content on white page background
- Borders: `gray-200`

**Mobile-First Design:**
- Layout uses `max-w-[480px]` for mobile viewport width
- Container centered with `mx-auto`
- Tailwind utility classes for responsive design
- No hover states (mobile-only interface)

## Important Notes

### General
- Russian-language application (lang="ru" in layout)
- No backend API - all data is loaded client-side from CSV via fetch
- Images must be placed in `/public/posts/` directory structure matching CSV photo paths
- ESLint configured but no test runner set up

### Deployment
- Static export to `/out` directory for GitHub Pages
- Requires `.nojekyll` file in output directory
- All asset paths must use `BASE_PATH` prefix (`/piter-catalog-tma`)
- CSV file updates take effect immediately without rebuild

### Data Updates
**To update restaurant data:**
1. Edit `/public/database_enriched.csv`
2. Push to GitHub repository
3. Users see changes on next page refresh (no rebuild required)

This hybrid architecture allows for rapid content updates while maintaining the performance benefits of static generation.

### Known Issues
- ESLint warning about `<img>` tag on line 116 of `app/page.js` (logo) - can be ignored for this use case
- No hover effects on buttons (mobile-only interface)

### Development Tips
- Use `npm run dev` for local development (runs on localhost:3000)
- Test with actual CSV data from `/public/database_enriched.csv`
- Verify image paths include BASE_PATH when testing production build
- Check `.nojekyll` file exists in `out/` directory after build
