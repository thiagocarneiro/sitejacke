/**
 * Script de migração WordPress → Astro Content Collections
 *
 * Uso: node scripts/migrate-wordpress.mjs
 *
 * Busca todos os posts do WordPress via REST API, converte HTML para Markdown,
 * baixa imagens e gera arquivos .md no diretório src/content/blog/.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(SITE_DIR, 'src', 'content', 'blog');
const IMAGES_DIR = path.join(SITE_DIR, 'public', 'images', 'blog');

const WP_BASE = 'https://nutricionistajackeline.com.br';
const WP_API = `${WP_BASE}/wp-json/wp/v2`;

// Páginas estáticas existentes — slugs que não podem ser usados por posts
const RESERVED_SLUGS = new Set([
  'sobre',
  'contato',
  'atendimento-e-consultas',
  'blog',
  'index',
]);

// ─── Turndown (HTML → Markdown) ─────────────────────────────────────────────

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});
turndown.use(gfm);

// Remove WordPress-specific elements
turndown.addRule('wpCaption', {
  filter: (node) =>
    node.nodeName === 'FIGURE' &&
    node.classList &&
    node.classList.contains('wp-block-image'),
  replacement: (_content, node) => {
    const img = node.querySelector('img');
    if (!img) return '';
    const alt = img.getAttribute('alt') || '';
    const src = img.getAttribute('src') || '';
    const caption = node.querySelector('figcaption');
    const captionText = caption ? caption.textContent.trim() : '';
    return captionText
      ? `![${alt}](${src})\n*${captionText}*\n\n`
      : `![${alt}](${src})\n\n`;
  },
});

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`);
  return res.json();
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  while (true) {
    const url = `${WP_API}/posts?per_page=100&page=${page}&_embed`;
    const res = await fetch(url);
    if (!res.ok) break;
    const batch = await res.json();
    if (batch.length === 0) break;
    posts.push(...batch);
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1');
    if (page >= totalPages) break;
    page++;
  }
  return posts;
}

async function fetchCategories() {
  const cats = await fetchJSON(`${WP_API}/categories?per_page=100`);
  const map = new Map();
  for (const c of cats) map.set(c.id, c.name);
  return map;
}

async function fetchTags() {
  const tags = await fetchJSON(`${WP_API}/tags?per_page=100`);
  const map = new Map();
  for (const t of tags) map.set(t.id, t.name);
  return map;
}

// ─── Image Download ──────────────────────────────────────────────────────────

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠ Could not download image: ${url} (${res.status})`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`  ⚠ Image download error: ${url}`, err.message);
    return false;
  }
}

function getImageExtension(url) {
  const u = new URL(url);
  const ext = path.extname(u.pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
    ? ext
    : '.jpg';
}

// ─── Content Processing ─────────────────────────────────────────────────────

async function processPostImages(htmlContent, slug) {
  const postImagesDir = path.join(IMAGES_DIR, slug);
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  let processed = htmlContent;
  let imgIndex = 0;

  const replacements = [];

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const originalUrl = match[1];
    // Only download images from the WordPress site
    if (!originalUrl.includes('nutricionistajackeline') && !originalUrl.startsWith('/'))
      continue;

    imgIndex++;
    const ext = getImageExtension(originalUrl);
    const filename = `img-${imgIndex}${ext}`;
    const localPath = path.join(postImagesDir, filename);
    const publicPath = `/images/blog/${slug}/${filename}`;

    const downloaded = await downloadImage(originalUrl, localPath);
    if (downloaded) {
      replacements.push({ from: originalUrl, to: publicPath });
    }
  }

  for (const { from, to } of replacements) {
    processed = processed.split(from).join(to);
  }

  return processed;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanMarkdown(md) {
  return (
    md
      // Remove excessive blank lines
      .replace(/\n{3,}/g, '\n\n')
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      .trim()
  );
}

// ─── Frontmatter ─────────────────────────────────────────────────────────────

function escapeYaml(str) {
  // If string contains special chars, wrap in quotes
  if (/[:#{}\[\],&*?|>!%@`]/.test(str) || str.includes('"') || str.includes("'")) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

function buildFrontmatter({
  title,
  description,
  publishDate,
  updatedDate,
  category,
  tags,
  featuredImage,
  featuredImageAlt,
}) {
  const lines = ['---'];
  lines.push(`title: ${escapeYaml(title)}`);
  lines.push(`description: ${escapeYaml(description)}`);
  lines.push(`publishDate: ${publishDate}`);
  if (updatedDate && updatedDate !== publishDate) {
    lines.push(`updatedDate: ${updatedDate}`);
  }
  if (category) {
    lines.push(`category: ${escapeYaml(category)}`);
  }
  if (tags.length > 0) {
    lines.push(`tags: [${tags.map((t) => escapeYaml(t)).join(', ')}]`);
  }
  if (featuredImage) {
    lines.push(`featuredImage: "${featuredImage}"`);
    lines.push(`featuredImageAlt: ${escapeYaml(featuredImageAlt)}`);
  }
  lines.push('draft: false');
  lines.push('---');
  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Fetching WordPress data...\n');

  const [posts, categoryMap, tagMap] = await Promise.all([
    fetchAllPosts(),
    fetchCategories(),
    fetchTags(),
  ]);

  console.log(`📝 Found ${posts.length} posts`);
  console.log(`📂 Categories: ${[...categoryMap.values()].join(', ')}`);
  console.log(`🏷️  Tags: ${[...tagMap.values()].join(', ')}\n`);

  // Ensure output directories exist
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  let migrated = 0;
  let skipped = 0;

  for (const post of posts) {
    const slug = post.slug;
    const title = decodeHtmlEntities(post.title.rendered);

    console.log(`\n── ${title}`);
    console.log(`   slug: ${slug}`);

    // Check for slug collisions with static pages
    if (RESERVED_SLUGS.has(slug)) {
      console.warn(`   ⚠ SKIPPED: slug "${slug}" conflicts with a static page!`);
      skipped++;
      continue;
    }

    // Extract featured image from _embedded
    let featuredImage = '';
    let featuredImageAlt = '';
    if (post._embedded && post._embedded['wp:featuredmedia']) {
      const media = post._embedded['wp:featuredmedia'][0];
      if (media && media.source_url) {
        const ext = getImageExtension(media.source_url);
        const imgFilename = `featured${ext}`;
        const imgLocalPath = path.join(IMAGES_DIR, slug, imgFilename);
        const downloaded = await downloadImage(media.source_url, imgLocalPath);
        if (downloaded) {
          featuredImage = `/images/blog/${slug}/${imgFilename}`;
          featuredImageAlt = media.alt_text || title;
          console.log(`   📷 Featured image downloaded`);
        }
      }
    }

    // Process inline images and convert HTML to Markdown
    const htmlWithLocalImages = await processPostImages(
      post.content.rendered,
      slug
    );
    const markdown = turndown.turndown(htmlWithLocalImages);
    const cleanedMarkdown = cleanMarkdown(markdown);

    // Extract metadata
    const description = decodeHtmlEntities(
      post.excerpt.rendered.replace(/<[^>]*>/g, '').trim()
    ).slice(0, 300);

    const postCategories = (post.categories || [])
      .map((id) => categoryMap.get(id))
      .filter(Boolean);
    const category = postCategories[0] || '';

    const postTags = (post.tags || [])
      .map((id) => tagMap.get(id))
      .filter(Boolean);

    const publishDate = post.date.split('T')[0];
    const updatedDate = post.modified.split('T')[0];

    // Build the file
    const frontmatter = buildFrontmatter({
      title,
      description,
      publishDate,
      updatedDate,
      category,
      tags: postTags,
      featuredImage,
      featuredImageAlt,
    });

    const fileContent = `${frontmatter}\n\n${cleanedMarkdown}\n`;
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    await fs.writeFile(filePath, fileContent, 'utf-8');

    console.log(`   ✅ Written: ${slug}.md`);
    migrated++;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Migration complete: ${migrated} posts migrated, ${skipped} skipped`);
  console.log(`📁 Content: ${CONTENT_DIR}`);
  console.log(`📁 Images: ${IMAGES_DIR}`);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
