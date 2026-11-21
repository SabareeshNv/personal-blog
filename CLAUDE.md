# CLAUDE.md — Lone Voice

Project memory for Claude. Read this before changing anything. Keep it current: when a decision changes, update this file in the same commit.

## What this is

**Lone Voice** is an anonymous personal microblog. It's a static site built with **Astro 7** and **plain modern CSS**, styled after the **Zune HD and Windows Phone 7/8** (Metro).

- **Repository:** `SabareeshNv/personal-blog`. Pushing to `main` deploys.
- **Hosting:** Cloudflare Pages.
  - Build command `npm run build`, output folder `dist`, `NODE_VERSION=22`.
  - Every push to `main` rebuilds the live site in about a minute.
- **Live address:** `https://lonevoice.pages.dev` (the owner switched to it from `personal-blog-afn.pages.dev`). The address is set in exactly **one** place: `url` in `src/site.config.ts`. Change it there and nowhere else.
- **History:** the project started in `SabareeshNv/Claude-microblog`. Its early commits contain an abandoned Malayalam version of the site. Ignore that repository: this repository is the only source of truth.

## How the owner works (follow these)

- **The owner also edits the code on a laptop** and pushes to `main`. Always pull (`git pull --ff-only origin main`) before starting work.

- **Design before code.** For new pages or visual changes, the owner approves a design first. That has been a Claude Design canvas: "Lone Voice — Zune design", https://claude.ai/artifact/VV3aN4Qhv2tNr5p5zyjMRY. Ask before building anything big that hasn't been designed.
- **Short, plain explanations.** The owner isn't a developer. Explain changes in everyday words.
- **Push to `main` when a change is done and verified.** The owner asked for this workflow, since `main` is what Cloudflare deploys. Don't open pull requests unless asked.
- **Verify visually.** For any motion or layout change, build the site and check it in a browser: screenshots at 390×844 (phone) and 1440×900 (desktop), plus slow-motion frames for animations (see Testing). Report what was and wasn't verified. The owner's phone is an **iPhone 17 on iOS 27** (Safari engine, 120 Hz screen); only Chromium is available in this environment.

## Hard rules and constraints

- **Anonymous.** No personal name, photo or author byline anywhere. The publisher is the site name (`SITE.publisher`) in structured data too. The owner said: "I won't be using my personal name in this website/blog."
- **No Tailwind, no CSS framework.** The owner explicitly switched from Tailwind 4 to hand-written modern CSS: grid, flexbox, custom properties and logical properties.
- **Co-located Astro components.** Each component keeps its markup, scoped `<style>` and `<script>` in one `.astro` file. Global CSS is only `tokens.css`, `global.css` (a reset plus `.container` and `.visually-hidden`) and `motion.css`.
- **Mobile first, three sizes.** Base styles (no media query) are the **mobile** layout, under 48rem (768 px). Two breakpoints switch to the larger sizes:
  - `@media (width >= 48rem)`: **tablet**, 768–1023 px. Two columns: the posts plus a **narrow 240 px sidebar** (32 px gap), stacked date block in an 80 px column (48 px day), 26 px post titles, 36 px article titles, 120 px **square** thumbnails, smaller sidebar type. (The owner chose this, "Option B", from the canvas; a full-width version with the sidebar below was rejected because the sidebar items didn't line up.)
  - `@media (width >= 64rem)`: **desktop**, 1024 px and up. Two columns with the full 320 px sidebar (64 px gap), 96 px date column, 32 px titles, 240×170 thumbnails.

  Tablet and desktop values are tokens that change at 48rem and again at 64rem (`--width-side`, `--gap-columns`, `--size-date-column`, `--text-date-day`, `--space-post-gutter`, `--size-thumb`, `--ratio-thumb`, `--text-post-title`, `--text-article-title`, `--text-side-heading`, `--text-side-tile`, `--size-side-tile`), so components mostly don't need their own media queries.

  The owner expects mobile, tablet and desktop to be distinct. Don't add another size without asking; a large-desktop or small-phone size has been offered but not chosen.
- **Tokens only.** Colours, font sizes, spacing and widths come from `src/styles/tokens.css`. Never hard-code a value a token exists for. Some tokens change value at 48rem, so components often need no media query.
- **English interface**, Open Sans 300/400/600 (via `@fontsource/open-sans`).
- **Dark only** (`color-scheme: dark`). Every colour token also has a light value via `light-dark()`. Changing it to `dark light` would follow the reader's system setting, but the owner hasn't asked for that.
- **Almost no JavaScript.** The only scripts are the search page (Pagefind), `MotionDirector`, and Astro's `<ClientRouter />`. Forms work without JavaScript.
- **Accessibility:** real links and buttons, visible focus outlines, a skip link, `aria-label` on icon-only controls, `alt` text required for covers (the schema enforces it), and `prefers-reduced-motion` turns all motion off.

## Design decisions (all approved by the owner)

- **Look:** black background, large thin lowercase type, the Windows Phone pivot menu (current item white, others grey), round outlined app-bar buttons, square tiles. Zune magenta accent `#d6006f`, a pink→orange gradient (`--gradient-zune`) and pink/orange weekday colours.
- **Header** (`SiteHeader`, never animated between pages):
  - On the homepage, a giant "lone voice" runs off the right edge, with the tagline underneath (`SITE.tagline`, currently "ideas half formed, feelings half named.").
  - Inner pages have a compact 64 px name.
  - Pink→orange angled shapes (`ZuneArt`) sit behind the name and fade to black on the left. On phones the shapes stay beside the name, clear of the menu.
  - No domain name is shown in the header (the owner asked to remove it).
- **Menu:** posts · topics · archive · about. There is **no "photos"** item (the owner removed it). On phones the menu scrolls sideways, with a fade at the right edge and a spacer after the last item.
- **Search button** (round, in the header): shown on phones; on tablet and desktop only on pages without a sidebar (the sidebar has a search box).
- **Layout:**
  - Desktop has two columns: the main column (760 px) and a sticky sidebar (320 px), 64 px apart, 1200 px maximum width.
  - Tablet has two columns too: the main column takes the rest, the sticky sidebar is 240 px, 32 px apart.
  - Phones have one column, with the sidebar below the content.
  - The gap below the header is 88 px on desktop and 48 px on phones (`--space-header`); the owner asked for more breathing room.
- **Sidebar contents and order:**
  1. Intro tile (homepage only; text in `SITE.intro`)
  2. Search box (Pagefind)
  3. Pinned post on a pink→orange card
  4. "subscribe with RSS", with a small "share" label and a row of round share buttons under it (Facebook, X, Telegram, WhatsApp; `ShareLinks.astro`). The same share block also sits under "Follow along" on the About page. They are plain links to each service's share page for the current page's address, open in a new tab (`RoundButton external`), and need no script. Brand icons come from Simple Icons (CC0) in `Icon.astro`.

  The owner rejected repeating the menu items in the sidebar, and rejected "recent covers".
- **Timeline** (`PostCard`): one column, newest first.
  - **Date block:** on tablet and desktop it's a vertical stack (small "NOV", 60 px thin "21", weekday in orange or pink alternately, then the year) with a thin divider before the post. On phones it's **one small line** ("21 NOV 2026 · SAT", 12 px semibold). The owner found the big date on phones squeezed the text and distracted from the title.
  - **Covers:** shown as a thumbnail beside the text (240×170 on desktop, a 120 px square on tablet, an 84 px square on phones). Only photo posts (a cover with no title) show it full width.
  - **Titles and text:** titles are 32 px bold. Summaries are a softer grey (`--color-body`). Notes are 19 px regular.
  - **Footer row:** tags (pink, no boxes) sit on the left and "continue reading →" (**white**, not pink) on the right edge, in one row. The owner found the stacked, same-coloured version cluttered.
  - Hairlines separate posts.
- **Other pages:** post (44 px title, prose, older/newer links), topics (tiles ordered by post count, then name; the first gets the gradient, the second magenta, the 1st and 7th are double width; 2 columns on phones, 3 on tablet, 4 on desktop; `grid-auto-flow: dense` lets small tiles fill gaps beside wide ones; has the sidebar, like the homepage and archive, at the owner's request), single topic, archive (year → month → rows), about, search, content and privacy policies (one shared layout), 404.
- **Footer:** an oversized faint "lone voice", the copyright line, and Content Policy / Privacy Policy links.

## Content model (`src/content.config.ts`)

Each post is a Markdown file in `src/content/posts/`. The file name becomes the URL (`/posts/<name>/`).

- **Required:** `date`.
- **Optional:** `title`, `description` (the timeline summary; otherwise an excerpt is used), `cover` + `coverAlt` (alt is required when there's a cover), `tags`, `link` + `linkTitle` (shows a link card), `pinned`, `updated` (shown on the post and sent to search engines), `draft`.
- **What a post has decides its kind:**
  - title (± cover) → titled post
  - cover without a title → photo post (full-width picture)
  - neither → note (shown in full on the timeline)
  - `link` works with any kind (the card goes under the text)
- **Cover images** live in `src/assets/covers/`. Astro resizes them.
- **Sample content is placeholder.** The 10 sample posts, the 3 generated cover images, the About text, both policies (`[bracketed]` text) and `SITE.intro` all need replacing by the owner. The sample "Starting this blog" post is marked `pinned`.

## Motion (Windows Phone page transitions) — read before touching

Built on Astro's `<ClientRouter />` (in `BaseHead.astro`), so pages swap without full reloads.

| File | Role |
| --- | --- |
| `src/components/MotionDirector.astro` | Picks the motion for each navigation, names the continuum elements, plays the turnstile exit and the lift |
| `src/lib/motion.ts` | `motionFor()` (pivot or turnstile), menu order, `EXIT` and `LIFT` timings, `shared` name builders |
| `src/styles/motion.css` | All CSS timings as tokens at the top, plus the keyframes for pivot, feather, continuum, tagline and search button |

**The motions:**
- **Pivot:** between menu sections (`/`, `/N/`, `/topics/`, `/archive/`, `/about/`). The main column slides sideways in the direction of the menu, and the old sidebar fades. Items don't feather during a pivot.
- **Turnstile:** every other navigation.
  - **Exit:** the visible items swing away one by one on a left-edge hinge, using the Web Animations API inside an overridden `event.loader`, in parallel with loading the next page.
  - **Entry:** the old column fades; the new column appears at once and its items **feather** in.
- **Feather — lists only** (timeline cards, topic tiles, archive rows, search results): each item turns in on its left-edge hinge, staggered. Use `class="feather"` with `style="--i: N"`, or `data-feather` on a list container. Non-list pages (post, about, policies, search box, page intros) turn in as **a few large blocks** (`.feather` on the block, never on each paragraph). The owner found per-paragraph and per-sidebar-item animation unnecessary.
- **Continuum:** a post's date, title and cover fly between its timeline card and the post page. The title gives a small lift first.
- **Header: never animated.** It has no `transition:name` and stays part of the root snapshot, which cross-fades in place (identical headers show no change; the homepage's large header and the compact one cross-fade). Windows Phone never animated a shared header; the earlier giant↔compact morph looked janky on desktop and was removed.
- **Sidebar: never animated** on navigation (same content on every page). It only cross-fades in a turnstile and fades out in a pivot.
- **Prefetch:** `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }` in `astro.config.mjs`, so the next page is usually ready before the exit ends (touch screens never hover). This is what keeps transitions smooth on phones.

**Current timings** (the owner has slowed them twice; ask before changing):
- Flights and feather: 0.6 s
- Feather stagger: 60 ms
- Turnstile exit: 265 ms per item, 53 ms apart, capped at 6 staggers
- Pivot: 0.26 s out, 0.53 s in, 0.1 s delay
- Old-column fade: 0.13 s
- Lift: 160 ms

**Lessons learned (each was a real bug the owner saw):**
1. **Never rotate or slide a whole tall column of text.** On phones its lines streak across the screen. That's why the exit swings individual items and the old column only fades.
2. **Never put static `transition:name` on list items.** Posts that appear on two pages fly across the screen. Timeline cards carry `data-continuum` markers instead, and `MotionDirector` names only the one card involved.
3. **Never pass an empty or undefined `transition:name`.** Astro then generates numbered names (`astro-<hash>-N`) that pair unrelated elements across pages. Render the directive only when the value exists.
4. **Post pages name their date, title and cover** (`data-flight` + `transition:name`). The director checks, after the next page has loaded, whether a partner exists. Unpaired pieces get `view-transition-name: none` and swing away or feather in like the rest. `.flying` marks pieces that really fly, and these skip the feather.
5. **Never name the site header or its pieces.** Named, it morphed (janky), flew in from above when the scroll position changed, and showed an off-screen header at the top. Unnamed, it cross-fades in place. Post pages have their own `<header>`; target the site header as `[data-site-header]` if ever needed.
6. **Shared elements whose size changes:** text (`view-transition-class: text`) and covers (`cover`) hide the old copy and scale the new one, instead of cross-fading two sizes.
7. **`::view-transition-group(main|sidebar)` has `animation: none`.** Morphing column boxes stretches the text.
8. **Page scripts run once under the client router.** Put setup in an `astro:page-load` listener (see `search.astro`).
9. **Links to files must never trigger the turnstile exit.** The owner tapped RSS on About, pressed Back, and saw an empty page: the exit had hidden the content, the browser then loaded `rss.xml` normally, and Safari's back/forward cache restored the page still hidden. Now: `RoundButton` adds `data-astro-reload` to links whose path has a file extension (so the client router ignores them), `MotionDirector` skips any navigation to a file path, and a `pageshow` (persisted) handler cancels leftover exit animations and names. Any new link to a file (feeds, images, downloads) must not go through the client router.

## SEO (`BaseHead.astro`, `src/lib/seo.ts`)

- **Every page:** unique title and description, canonical link, `robots` meta, Open Graph and Twitter tags.
- **Link-preview images:** 1200×630 — covers are cropped with `getImage`; other pages use `public/og-default.jpg`. That image shows "lone voice" and the tagline; regenerate it whenever `SITE.tagline` changes (render an HTML page with Open Sans 300 and the Zune shapes at 1200×630 in Playwright, then save as JPEG).
- **Clean URLs:** `trailingSlash: 'always'`.
- **Structured data (JSON-LD):** `WebSite` with a `SearchAction` on page 1, `BlogPosting` and `BreadcrumbList` on posts, breadcrumbs on topic pages.
- **Crawling:**
  - The sitemap excludes `/search/`.
  - `robots.txt` is generated from the site address (`src/pages/robots.txt.ts`).
  - Search and 404 are `noindex`.
- **RSS** (`/rss.xml`): full content, the cover first (also as `media:content`), the link at the end, root-relative URLs made absolute.

## Search

Pagefind indexes `[data-pagefind-body]` (post pages only) after `astro build`. The date block and tags are `data-pagefind-ignore`; the date is passed as attribute meta. Search **doesn't work in `npm run dev`**: use `npm run build && npm run preview`.

## Commands and testing

```sh
npm install
npm run dev       # drafts visible; no search
npm run build     # astro check (must report 0 errors / 0 warnings) + build + pagefind
npm run preview
```

- **Preview server:** Astro 7's `astro preview` is a single instance. If one is running, a new call says "already running at …" (check the log for the port). Stop it with `npx astro preview stop`.
- **Browser:** Chromium and Playwright are preinstalled. Don't run `playwright install`.
- **Visual checks:**
  - Screenshots at 390×844 and 1440×900.
  - Slow motion: create a CDP session, call `Animation.enable` and `Animation.setPlaybackRate({ playbackRate: 0.1 })`, then take screenshots every ~500 ms during a navigation.
- **Motion audit:**
  - **Unpaired elements:** for each kind of navigation (home → post, deep tap, archive/search/pinned → post, post → older post, post → menu, pivots, back), record computed `view-transition-name`s on `astro:before-swap` (old page) and `astro:after-swap` (new page). Anything on only one side, except `root`, `main` and `sidebar`, is jank. The expected flying names are only `post-date-*`, `post-title-*` and `post-cover-*`.
  - **Running animations:** `document.getAnimations()` right after a swap lists every animation, including the view-transition pseudo-elements.
- **The live site is reachable from this environment** for checks after a deploy.

## Code map

```
src/site.config.ts      SITE (title, tagline, intro, url, publisher, socialImage, lang, locale,
                        timeZone Asia/Kolkata, pageSize 10, copyrightYear), NAV, LEGAL_LINKS
src/content.config.ts   post schema
src/lib/posts.ts        getPosts, isPhoto/isNote, excerpt/summary/displayTitle, topics, pinned,
                        archive grouping, linkHost
src/lib/format.ts       date parts in SITE.timeZone (en-GB)
src/lib/seo.ts          JSON-LD builders
src/lib/motion.ts       motion choice, timings, shared names
src/layouts/BaseLayout  head, skip link, header, main (+ optional sidebar slot), footer, MotionDirector
src/layouts/PageLayout  single-column text pages (About, policies)
src/components/         one component per piece of the design (see README table)
src/pages/              [...page] (home), posts/[slug], topics/, topics/[topic], archive, about,
                        search, content-policy, privacy-policy, 404, rss.xml.ts, robots.txt.ts
public/                 favicon.svg, apple-touch-icon.png, og-default.jpg
```

## Open items and ideas (not done unless the owner asks)

- **Waiting on the owner:**
  - Real content (posts, About, policies, intro text).
  - Submit `https://lonevoice.pages.dev/sitemap-index.xml` to Google Search Console and Bing (and again if a custom domain is added later).
  - Checking motion on the iPhone.
- **Offered but not chosen yet:**
  - `public/_headers` for long cache times and security headers.
  - Load the first homepage cover eagerly.
  - A Git-based CMS (Pages CMS or Decap) for writing from a phone.
  - A light theme switch.
  - Cloudflare Web Analytics (cookie-free; would need a privacy-policy mention).
- **Rejected:** comments, comment counts, reading time, a "photos" section, sidebar copies of menu items, "recent covers", a personal name or photo, Tailwind.
