import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getImage } from 'astro:assets';
import { displayTitle, getPosts, linkHost, postUrl, summary, type Post } from '@/lib/posts';
import { SITE } from '@/site.config';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Feed readers live on other sites, so root-relative links must become absolute. */
const absolutize = (html: string, site: URL) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`);

/** The post as HTML for the feed: cover, then the text, then the link it is about. */
async function feedContent(post: Post, site: URL) {
  const parts: string[] = [];
  let coverUrl: string | undefined;

  if (post.data.cover) {
    const image = await getImage({ src: post.data.cover, width: 1200, format: 'jpg', quality: 82 });
    coverUrl = new URL(image.src, site).href;
    parts.push(`<p><img src="${coverUrl}" alt="${escape(post.data.coverAlt ?? '')}"></p>`);
  }
  parts.push(absolutize(post.rendered?.html ?? '', site));
  if (post.data.link) {
    const label = post.data.linkTitle ?? linkHost(post.data.link);
    parts.push(`<p>→ <a href="${escape(post.data.link)}">${escape(label)}</a></p>`);
  }
  return { html: parts.join('\n'), coverUrl };
}

export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { html, coverUrl } = await feedContent(post, site);
      return {
        title: displayTitle(post),
        link: postUrl(post),
        pubDate: post.data.date,
        description: summary(post),
        content: html,
        categories: post.data.tags,
        // The cover as the item's thumbnail (Media RSS), for readers that show one.
        customData: coverUrl ? `<media:content url="${coverUrl}" medium="image" />` : undefined,
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    xmlns: { media: 'http://search.yahoo.com/mrss/' },
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
