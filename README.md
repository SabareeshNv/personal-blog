# Lone Voice

A personal microblog at [lonevoice.pages.dev](https://lonevoice.pages.dev), styled after the Zune HD and Windows Phone: black pages, large thin type, a pivot menu and pink-to-orange accents.

It is a static site built with [Astro](https://astro.build) and plain modern CSS (grid, flexbox, custom properties). It has no CSS framework and ships almost no JavaScript. The only script is search, which uses [Pagefind](https://pagefind.app).

```sh
npm install
npm run dev       # http://localhost:4321 (drafts visible; search is not)
npm run build     # type-check, build to dist/, then build the search index
npm run preview   # serve dist/ — use this to try search
```

## Writing a post

Each post is a Markdown file in `src/content/posts/`. The file name becomes the URL: `slow-web.md` → `/posts/slow-web/`.

Only `date` is required:

```md
---
date: 2026-11-21T11:15:00+05:30
---

A short note. Most posts look like this.
```

Everything else is optional and can be combined:

```md
---
date: 2026-11-21T21:42:00+05:30
title: Starting this blog
description: One-line summary shown on the timeline (else the opening text is used).
cover: ../../assets/covers/hills-dusk.jpg
coverAlt: Layered hills at dusk.        # required when there is a cover
tags: [meta, astro]
pinned: true                            # show in the sidebar's “pinned” slot
draft: true                             # only visible in `npm run dev`
---
```

What a post has decides how it looks on the timeline:

| The post has      | On the timeline                                        |
| ----------------- | ------------------------------------------------------ |
| title             | Title, summary, “continue reading”, tags               |
| title and cover   | The same, with the cover as a thumbnail beside it      |
| cover, no title   | A photo post: the picture full width, then the text    |
| neither           | A note: the full text                                  |

Put cover images in `src/assets/covers/`. Astro resizes them and converts them to WebP at build time.

## Pages

| URL                  | Page                                                   |
| -------------------- | ------------------------------------------------------ |
| `/`                  | All posts, newest first, 10 per page (`/2/`, `/3/`, …) |
| `/posts/<name>/`     | One post, with links to the older and newer posts       |
| `/topics/`           | Every tag as a tile, the most used first               |
| `/topics/<tag>/`     | The posts with that tag                                |
| `/archive/`          | Every post by year and month                           |
| `/about/`            | About the blog (`src/pages/about.astro`)               |
| `/search/?q=…`       | Search results                                         |
| `/content-policy/`, `/privacy-policy/` | The policies (placeholder text to replace) |
| `/rss.xml`           | RSS feed                                               |

## Changing things

- **Site name, tagline, intro tile text, page size, time zone, menu, footer links:** `src/site.config.ts`.
- **Colours, type sizes, spacing, widths:** `src/styles/tokens.css`. Every component uses these custom properties, so a change there applies everywhere.
- **Light theme:** every colour already has a light value. In `tokens.css`, change `color-scheme: dark` to `color-scheme: dark light` to follow the reader's system setting.

## How the code is organised

```
src/
  site.config.ts        site settings
  content.config.ts     the post schema
  content/posts/        the posts (Markdown)
  assets/covers/        cover images
  styles/
    tokens.css          design tokens: colour, type, space, layout
    global.css          reset, base typography, .container, .visually-hidden
  lib/
    posts.ts            loading, sorting, grouping and summarising posts
    format.ts           date formatting
  layouts/
    BaseLayout.astro    <head>, header, main (+ optional sidebar), footer
    PageLayout.astro    single-column text pages (About, policies)
  components/           one component per piece of the design
  pages/                one file per route
```

Each component keeps its markup, its styles (scoped with `<style>`) and its script (if any) in one `.astro` file, so changing a piece of the design means editing one file. Global CSS is limited to the tokens, a reset and two utilities.

| Component          | What it draws                                                  |
| ------------------ | -------------------------------------------------------------- |
| `SiteHeader`       | The giant homepage name or the compact one, the search button and the menu |
| `ZuneArt`          | The pink-to-orange angled shapes behind the header             |
| `PivotNav`         | The menu: current page white, others grey                      |
| `PostCard`         | One post on a timeline (title / thumbnail / photo / note)      |
| `PostDate`         | The date: one small line on phones, the stacked block on wider screens |
| `Timeline`         | A list of `PostCard`s                                          |
| `Sidebar`          | Intro tile, search, pinned post, RSS                           |
| `SearchBox`        | The search form (works without JavaScript)                     |
| `PinnedCard`       | The pinned post on the gradient card                           |
| `PageIntro`        | The large title, back link and lede on inner pages             |
| `Prose`            | Typography for post bodies and text pages                      |
| `RoundButton`      | The round outlined Windows Phone button                        |
| `TagList`, `Pagination`, `Icon`, `SiteFooter`, `BaseHead` | As named |

### CSS conventions

- **Mobile first.** Base styles are for phones. Wider screens are added with `@media (width >= 48rem)` (tablet) and `@media (width >= 64rem)` (desktop, two columns). These are the only two breakpoints.
- **Tokens only.** Colours, font sizes and spacing come from `tokens.css`. Some tokens change value at 48rem, so components often need no media query at all.
- **Logical properties** (`margin-block-start`, `padding-inline`) and **flexbox/grid with `gap`** for layout.
- **Accessible by default:** real links and buttons, visible focus outlines, a skip link, labelled icons, and `prefers-reduced-motion` respected.

## Deploying

The site is fully static. On Cloudflare Pages, set the build command to `npm run build` and the output directory to `dist`.
