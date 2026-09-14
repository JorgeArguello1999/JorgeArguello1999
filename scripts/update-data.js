#!/usr/bin/env node
/**
 * update-data.js — Generate static "database" without backend
 *
 * 1) Fetch YouTube RSS feed (@al3x_argu -> UCVgabwEiFAunNH6c7abqoCQ)
 * 2) Read all markdown files in docs/blog/posts/*.md and generate posts.json
 * 3) Write docs/data/youtube.json, posts.json and db.json
 *
 * Usage:
 *   node scripts/update-data.js          # local
 *   node scripts/update-data.js --force  # force fetch even if cached
 *
 * No external dependencies required. Requires Node >= 18 (native fetch).
 * In CI (GitHub Actions) it runs on every push and weekly.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'docs', 'data');
const POSTS_DIR = path.join(ROOT, 'docs', 'blog', 'posts');

const YT_CHANNEL_ID = 'UCVgabwEiFAunNH6c7abqoCQ';
const YT_HANDLE = '@al3x_argu';
const YT_FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;

// ---------- helpers ----------
function log(msg) { console.log(`[update-data] ${msg}`); }
function warn(msg) { console.warn(`[update-data] WARN: ${msg}`); }

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function parseDateFromSlug(name) {
  const m = name.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function titleFromMd(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function excerptFromMd(md) {
  let text = md.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/^#.*$/gm, '');
  text = text.replace(/[`*_#>~\[\]()!]/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > 180 ? text.slice(0, 180) + '…' : text;
}

// Very simple XML parser for YouTube Atom feed (no deps)
function parseYouTubeFeed(xmlText) {
  const videos = [];
  // channel title
  const channelTitleMatch = xmlText.match(/<feed[^>]*>[\s\S]*?<title>([^<]+)<\/title>/);
  const channelTitle = channelTitleMatch ? channelTitleMatch[1].trim() : 'Jorge Alexander Arguello';

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xmlText)) !== null) {
    const entry = m[1];
    const get = (tag) => {
      const r = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return r ? r[1].trim() : '';
    };
    // yt:videoId, title, link href, published, updated, author/name, media:description, media:thumbnail, media:statistics, media:starRating
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const linkMatch = entry.match(/<link[^>]*href="([^"]+)"[^>]*\/>/);
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const updatedMatch = entry.match(/<updated>([^<]+)<\/updated>/);
    const authorMatch = entry.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const thumbMatch = entry.match(/<media:thumbnail[^>]*url="([^"]+)"[^>]*>/);
    const viewsMatch = entry.match(/<media:statistics[^>]*views="([^"]+)"[^>]*>/);
    const starAvgMatch = entry.match(/<media:starRating[^>]*average="([^"]+)"/);
    const starCntMatch = entry.match(/<media:starRating[^>]*count="([^"]+)"/);

    const id = idMatch ? idMatch[1].trim() : '';
    if (!id) continue;
    const title = titleMatch ? titleMatch[1].trim() : id;
    const url = linkMatch ? linkMatch[1].trim() : `https://www.youtube.com/watch?v=${id}`;
    // link may be alternate without yt, try fallback
    const hrefFallback = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${id}`;

    videos.push({
      id,
      title,
      url: hrefFallback,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      published: publishedMatch ? publishedMatch[1].trim() : '',
      updated: updatedMatch ? updatedMatch[1].trim() : '',
      author: authorMatch ? authorMatch[1].trim() : channelTitle,
      description: descMatch ? descMatch[1].trim() : '',
      thumbnail: thumbMatch ? thumbMatch[1].trim() : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      thumbnailMq: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      thumbnailHq: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      thumbnailMax: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      views: viewsMatch ? parseInt(viewsMatch[1], 10) : null,
      starRating: starAvgMatch ? parseFloat(starAvgMatch[1]) : null,
      starCount: starCntMatch ? parseInt(starCntMatch[1], 10) : null,
    });
  }

  return { channelTitle, videos };
}

async function fetchYouTube() {
  log(`Fetching YouTube feed: ${YT_FEED}`);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(YT_FEED, { signal: controller.signal, headers: { 'User-Agent': 'update-data-script/1.0' } });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const { channelTitle, videos } = parseYouTubeFeed(xml);
    log(`Found ${videos.length} video(s) from channel "${channelTitle}"`);
    return { channelTitle, videos };
  } catch (e) {
    clearTimeout(t);
    warn(`Failed to fetch YouTube feed: ${e.message}`);
    return null;
  }
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    warn(`Posts dir not found: ${POSTS_DIR}`);
    return [];
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => /\.md$/i.test(f));
  files.sort((a, b) => (a < b ? 1 : -1)); // newest first (lexicographic with YYYY-MM-DD prefix)
  const posts = [];
  for (const file of files) {
    const full = path.join(POSTS_DIR, file);
    try {
      const md = fs.readFileSync(full, 'utf8');
      const slug = file.replace(/\.md$/i, '');
      const title = titleFromMd(md) || slug;
      const date = parseDateFromSlug(file); // YYYY-MM-DD
      const excerpt = excerptFromMd(md);
      const published = date ? new Date(date + 'T00:00:00.000Z').toISOString() : null;
      posts.push({
        slug,
        title,
        date, // YYYY-MM-DD for compatibility with frontend parseDate()
        published,
        excerpt,
        file,
        content: md,
      });
      log(`Post: ${slug} -> "${title}"`);
    } catch (e) {
      warn(`Error reading ${file}: ${e.message}`);
    }
  }
  // sort by date desc, fallback slug
  posts.sort((a, b) => {
    const da = a.date ? +new Date(a.date) : 0;
    const db = b.date ? +new Date(b.date) : 0;
    if (da !== db) return db - da;
    return a.slug < b.slug ? 1 : -1;
  });
  return posts;
}

async function main() {
  ensureDir(DATA_DIR);
  const updatedAt = new Date().toISOString();

  // 1. YouTube
  let ytData = null;
  let ytResult = await fetchYouTube();

  // If fetch fails, keep existing youtube.json if available
  const existingYtPath = path.join(DATA_DIR, 'youtube.json');
  if (!ytResult) {
    if (fs.existsSync(existingYtPath)) {
      log('Using existing youtube.json as fallback');
      try {
        ytData = JSON.parse(fs.readFileSync(existingYtPath, 'utf8'));
        // update timestamp
        ytData.updatedAt = updatedAt;
      } catch (_) {
        ytData = null;
      }
    }
    if (!ytData) {
      warn('No previous youtube.json found, creating empty stub');
      ytData = {
        channel: {
          id: YT_CHANNEL_ID,
          handle: YT_HANDLE,
          title: 'Jorge Alexander Arguello',
          url: `https://www.youtube.com/${YT_HANDLE}`,
          channelUrl: `https://www.youtube.com/channel/${YT_CHANNEL_ID}`,
          feedUrl: YT_FEED,
        },
        updatedAt,
        videos: [],
      };
    }
  } else {
    ytData = {
      channel: {
        id: YT_CHANNEL_ID,
        handle: YT_HANDLE,
        title: ytResult.channelTitle,
        url: `https://www.youtube.com/${YT_HANDLE}`,
        channelUrl: `https://www.youtube.com/channel/${YT_CHANNEL_ID}`,
        feedUrl: YT_FEED,
      },
      updatedAt,
      videos: ytResult.videos,
    };
  }

  // Sort videos by published desc
  if (ytData && ytData.videos) {
    ytData.videos.sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  // 2. Posts
  const posts = loadPosts();

  // 3. Write files
  const ytPath = path.join(DATA_DIR, 'youtube.json');
  const postsPath = path.join(DATA_DIR, 'posts.json');
  const dbPath = path.join(DATA_DIR, 'db.json');

  fs.writeFileSync(ytPath, JSON.stringify(ytData, null, 2) + '\n', 'utf8');
  log(`Wrote ${ytPath} (${ytData.videos.length} videos)`);

  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');
  log(`Wrote ${postsPath} (${posts.length} posts)`);

  const db = {
    site: {
      name: 'Jorge Argüello',
      handle: YT_HANDLE,
      youtube: `https://www.youtube.com/${YT_HANDLE}`,
      updatedAt,
    },
    youtube: ytData,
    posts,
  };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
  log(`Wrote ${dbPath}`);

  // Summary
  console.log('\n=== Summary ===');
  console.log(`YouTube videos: ${ytData.videos.length}`);
  console.log(`Blog posts: ${posts.length}`);
  console.log(`updatedAt: ${updatedAt}`);
  console.log('Done. Data will be loaded without backend on every GitHub Pages deploy.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
