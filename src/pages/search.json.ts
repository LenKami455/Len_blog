import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const posts = await getCollection('blog');
	const index = posts
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((post) => ({
			id: post.id,
			title: post.data.title,
			description: post.data.description,
			tags: post.data.tags,
			category: post.data.category ?? null,
			pubDate: post.data.pubDate.toISOString(),
			url: `/blog/${post.id}/`,
		}));
	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json' },
	});
};
