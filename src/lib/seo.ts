/**
 * Structured data (schema.org JSON-LD) for search engines.
 * Each page passes the objects that describe it to <BaseLayout schema={…}>.
 */
import { SITE } from '@/site.config';
import { displayTitle, postUrl, summary, type Post } from './posts';

type Json = Record<string, unknown>;

const absolute = (path: string) => new URL(path, SITE.url).href;

const publisher = {
  '@type': 'Organization',
  name: SITE.publisher,
  url: absolute('/'),
  logo: { '@type': 'ImageObject', url: absolute('/apple-touch-icon.png') },
};

/** The site itself, with its search box (shown as a sitelinks search box). */
export const websiteSchema = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.title,
  url: absolute('/'),
  description: SITE.description,
  inLanguage: SITE.lang,
  publisher,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${absolute('/search/')}?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

/** One post. `image` is the absolute URL of its social image. */
export const postSchema = (post: Post, image: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: displayTitle(post),
  description: summary(post),
  url: absolute(postUrl(post)),
  mainEntityOfPage: absolute(postUrl(post)),
  datePublished: post.data.date.toISOString(),
  dateModified: (post.data.updated ?? post.data.date).toISOString(),
  image,
  keywords: post.data.tags.join(', ') || undefined,
  inLanguage: SITE.lang,
  author: { '@type': 'Organization', name: SITE.publisher, url: absolute('/about/') },
  publisher,
});

/** Breadcrumbs, e.g. [['Lone Voice', '/'], ['Topics', '/topics/'], ['#design', '/topics/design/']]. */
export const breadcrumbSchema = (trail: [name: string, path: string][]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: absolute(path),
  })),
});
