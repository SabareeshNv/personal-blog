import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '@/site.config';
import { monthNameOf, yearOf } from './format';

export type Post = CollectionEntry<'posts'>;

/** All published posts, newest first. Drafts show only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (post: Post) => `/posts/${post.id}/`;

/** A cover with no title is a photo post: its picture runs full width. */
export const isPhoto = (post: Post) => Boolean(post.data.cover && !post.data.title);

/** No title and no cover: a short note, shown in full on the timeline. */
export const isNote = (post: Post) => !post.data.title && !post.data.cover;

/** Plain text of the Markdown body, for excerpts and search titles. */
export function plainText(post: Post): string {
  return (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, ' ')
    .replace(/[#>*_`~|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(post: Post, length = 180): string {
  const text = plainText(post);
  if (text.length <= length) return text;
  return text.slice(0, text.lastIndexOf(' ', length)).replace(/[,.;:]$/, '') + '…';
}

/** A readable title for any post: its own, or the opening words of the text. */
export const displayTitle = (post: Post) => post.data.title ?? excerpt(post, 60);

/** Summary shown on the timeline for titled posts. */
export const summary = (post: Post) => post.data.description ?? excerpt(post);

/** “example.com” from a link, without “www.”. */
export const linkHost = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** Lowercase, hyphenated, URL-safe version of a tag. */
export const slugify = (value: string) =>
  value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');

export const tagUrl = (tag: string) => `/topics/${slugify(tag)}/`;

export interface Topic {
  slug: string;
  name: string;
  posts: Post[];
}

/** Every tag with its posts, most-used first. */
export async function getTopics(): Promise<Topic[]> {
  const topics = new Map<string, Topic>();
  for (const post of await getPosts()) {
    for (const name of post.data.tags) {
      const slug = slugify(name);
      const topic = topics.get(slug) ?? { slug, name, posts: [] };
      topic.posts.push(post);
      topics.set(slug, topic);
    }
  }
  return [...topics.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, SITE.locale),
  );
}

/** The newest post marked `pinned: true`, if any. */
export async function getPinned(): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.data.pinned);
}

/** Posts grouped by year, then by month, for the archive. */
export function groupByYearAndMonth(posts: Post[]) {
  const years = Map.groupBy(posts, (post) => yearOf(post.data.date));
  return [...years].map(([year, yearPosts]) => ({
    year,
    months: [...Map.groupBy(yearPosts, (post) => monthNameOf(post.data.date))].map(([month, items]) => ({
      month,
      posts: items,
    })),
  }));
}
