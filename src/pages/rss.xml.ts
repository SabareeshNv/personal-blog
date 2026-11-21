import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { displayTitle, getPosts, postUrl, summary } from '@/lib/posts';
import { SITE } from '@/site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: displayTitle(post),
      link: postUrl(post),
      pubDate: post.data.date,
      description: summary(post),
      content: post.rendered?.html,
      categories: post.data.tags,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
