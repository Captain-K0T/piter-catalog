# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 restaurant catalog application designed as a Telegram Mini App (TMA). It displays restaurants from St. Petersburg, Russia, with filtering, search, and detail pages. The app is optimized for mobile viewing and integrates with the Telegram WebApp API.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack

- Next.js 15.5.2 with App Router
- React 19.1.0
- Tailwind CSS 4
- TypeScript 5
- Telegram WebApp SDK (loaded via CDN)

## Architecture

### Data Management

Restaurant data is loaded dynamically from a CSV file (`/public/database_enriched.csv`) using a custom client-side parser:
- `app/utils/csvParser.js` - Custom CSV parser with support for quoted fields and proper escaping
- `app/data/restaurants.js` - Contains `loadRestaurants(limit)` function that fetches and parses the CSV
- `app/data/categories.js` - Category definitions with emojis (cuisine types and venue types)
- `app/data/metroStations.js` - Set of metro station hashtags for filtering

**CSV Structure:**
- Headers include: id, telegram_link, text_html, photo_path_1 through photo_path_10, hashtag_1 through hashtag_6, title_2gis, rating_2gis, average_check_2gis
- Restaurant data is parsed and transformed into objects with arrays for photos and hashtags
- Photos are automatically prefixed with `/posts/` during parsing
- Average check values are cleaned (removing currency symbols) and converted to integers

**Loading Strategy:**
- `loadRestaurants(limit)` accepts an optional limit parameter (defaults to all)
- Currently set to load only 3 restaurants on the main page (`loadRestaurants(3)`)
- Restaurant detail pages load all restaurants to find the matching ID

**Data Transformation:**
During CSV parsing, the following transformations occur:
- Multiple `photo_path_1` through `photo_path_10` columns are consolidated into a single `photo_path` array
- Multiple `hashtag_1` through `hashtag_6` columns are consolidated into a single `hashtags` array
- HTML content in `text_html` is stripped to plain text and truncated to 2 sentences for `text_summary`
- Empty/whitespace-only values are filtered out from arrays
- All photo paths automatically receive `/posts/` prefix

### Project Structure

The project has both `app/` and `src/app/` directories:
- `app/` - Contains all application code (components, data, pages, utilities)
- `src/app/` - Contains only Next.js configuration files (layout.tsx, page.tsx)
- Main application logic lives in `app/` directory

### Component Structure

**Pages:**
- `app/page.js` - Main catalog page with client-side filtering, search, and pagination
- `app/restaurant/[id]/page.jsx` - Dynamic restaurant detail page

**Components:**
- `SearchBar.jsx` - Search input with auto-suggestions (shows top 5 matches for 2+ characters)
- `CategoryFilter.jsx` - Horizontal scrolling category pills
- `RestaurantCard.jsx` - Restaurant preview card with tags, rating, and average check
- `ImageSlider.jsx` - Photo carousel for restaurant images

### Key Patterns

**Client-Side Rendering:** Main page uses `"use client"` directive with React hooks (useState, useMemo, useEffect) for all filtering logic.

**Filtering Logic:**
- Category filter works via hashtag matching
- Search filter matches against `title_2gis` (case-insensitive)
- Both filters work together (AND logic)
- Results are paginated with "Load More" button (10 items per page)

**Telegram Integration:**
- Telegram WebApp SDK loaded in `layout.js` via Next.js Script component
- `window.Telegram.WebApp.ready()` and `window.Telegram.WebApp.expand()` called on mount
- Layout constrained to mobile viewport (max-width: 450px) centered on desktop

**Path Aliases:**
- Uses `@/*` to reference root directory files (configured in tsconfig.json)
- Example: `import { allRestaurants } from '@/app/data/restaurants'`

**Image Handling:**
- Photos stored locally in `/public/posts/` directory
- Image paths stored as arrays in restaurant data
- ImageSlider component handles multiple photos per restaurant

### Tag System

Two types of hashtags:
1. **Metro station tags** - Filtered as separate category (e.g., `#Площадь_Восстания`)
2. **Category tags** - Cuisine and venue types (e.g., `#итальянская_кухня`, `#завтраки`)

Tags are clickable and toggle the category filter. Display format removes `#` and replaces `_` with spaces.

### Mobile-First Design

- Layout uses `max-h-[100dvh]` for mobile viewport height
- Container max width of 450px with shadow for desktop viewing
- Tailwind classes for responsive design
- Gray background with white content card for mobile app feel

## Important Notes

- This is a Russian-language application (lang="ru" in layout)
- No backend API - all data is loaded client-side from CSV via fetch
- Images must be placed in `/public/posts/` directory structure matching CSV photo paths
- Restaurant detail page shows placeholder "—" for address and link fields (not yet implemented in data)
- ESLint configured but no test runner set up
- The main page currently limits loading to 3 restaurants - adjust the `loadRestaurants(3)` parameter in `app/page.js` to change this
- CSV file must be in `/public/` directory to be accessible via fetch
- Custom CSS classes use "glass" effect styling (defined in globals.css)
