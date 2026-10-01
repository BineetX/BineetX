// Public data only. Node 22+, no dependencies or personal access token required.
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const escapeXML = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
export function summarize(repositories, owner) {
  const repos = repositories.filter(repo => !repo.private && !repo.fork && repo.name.toLowerCase() !== owner.toLowerCase());
  const counts = new Map();
  for (const repo of repos) if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  return {
    count: repos.length,
    languages: [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    recent: repos.filter(repo => !repo.archived && repo.pushed_at).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 3),
  };
}

export async function fetchRepositories(owner, request = fetch) {
  const repositories = [];
  for (let page = 1; ; page++) {
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'BineetX-profile' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await request(`https://api.github.com/users/${encodeURIComponent(owner)}/repos?type=owner&per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}; existing artwork was preserved.`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub response; existing artwork was preserved.');
    repositories.push(...batch);
    if (batch.length < 100) return repositories;
  }
}

export function renderActivity(data, date, mobile = false) {
  const colors = ['#B5E8C3', '#85AEA4', '#D1C8A7', '#80908A', '#567465'];
  const t = (x, y, value, size = 14, color = '#A9B6AE', attrs = '') => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" ${attrs}>${escapeXML(value)}</text>`;
  let body = t(32, 34, 'PUBLIC / REPOSITORY SNAPSHOT', 12, '#B5E8C3', 'letter-spacing="2"');
  body += t(968, 34, `UPDATED ${date}`, 11, '#A9B6AE', 'text-anchor="end" letter-spacing="1"');
  body += '<path d="M32 53 H968 M270 76 V232 M630 76 V232" fill="none" stroke="#2A3632"/>';
  body += t(32, 126, data.count, 62, '#F2F0E7', 'font-weight="600" letter-spacing="-3"');
  body += t(34, 155, 'Public repositories', 16, '#F2F0E7');
  body += t(34, 183, 'Excludes forks & profile', 12);
  body += t(300, 91, 'PRIMARY LANGUAGES', 11, '#A9B6AE', 'letter-spacing="1.5"');
  // Counts are repositories, not code bytes or a claim about proficiency.
  const total = data.languages.reduce((sum, [, count]) => sum + count, 0);
  const visible = data.languages.slice(0, 4);
  if (data.languages.length > 4) visible.push(['Other', data.languages.slice(4).reduce((sum, [, count]) => sum + count, 0)]);
  let offset = 300;
  for (const [i, [, count]] of visible.entries()) {
    const width = count / total * 295;
    body += `<rect x="${offset}" y="109" width="${Math.max(.1, width - 2)}" height="9" rx="2" fill="${colors[i]}"/>`;
    offset += width;
  }
  if (!total) body += t(300, 144, 'No language data available', 14);
  for (const [i, [language, count]] of visible.entries()) {
    const y = 145 + i * 20;
    body += `<circle cx="304" cy="${y - 4}" r="3" fill="${colors[i]}"/>`;
    body += t(316, y, language.length > 26 ? `${language.slice(0, 25)}…` : language, 13);
    body += t(595, y, count, 13, '#F2F0E7', 'text-anchor="end"');
  }
  body += t(660, 91, 'RECENT PUSHES', 11, '#A9B6AE', 'letter-spacing="1.5"');
  if (!data.recent.length) body += t(660, 139, 'No public pushes available', 14);
  for (const [i, repo] of data.recent.entries()) {
    const name = repo.name.length > 22 ? `${repo.name.slice(0, 21)}…` : repo.name;
    const y = 131 + i * 40;
    body += t(660, y, name, 15, '#F2F0E7');
    body += t(968, y, repo.pushed_at.slice(0, 10), 11, '#A9B6AE', 'text-anchor="end"');
  }
  if (mobile) {
    body = t(24, 29, 'PUBLIC / REPOSITORY SNAPSHOT', 11, '#B5E8C3', 'letter-spacing="1"');
    body += t(24, 52, `UPDATED ${date}`, 11);
    body += t(22, 116, data.count, 56, '#F2F0E7', 'font-weight="600"');
    body += t(90, 95, 'Public repositories', 18, '#F2F0E7');
    body += t(90, 118, 'Excludes forks & profile', 12);
    body += '<path d="M24 140 H396 M24 315 H396" stroke="#2A3632"/>';
    body += t(24, 168, 'PRIMARY LANGUAGES', 12, '#A9B6AE', 'letter-spacing="1"');
    if (!total) body += t(24, 200, 'No language data available');
    for (const [i, [language, count]] of visible.entries()) {
      const y = 197 + i * 23;
      body += t(24, y, language.length > 22 ? `${language.slice(0, 21)}…` : language, 14, '#F2F0E7');
      body += `<rect x="240" y="${y - 9}" width="${count / total * 116}" height="7" rx="2" fill="${colors[i]}"/>`;
      body += t(396, y, count, 14, '#F2F0E7', 'text-anchor="end"');
    }
    body += t(24, 345, 'RECENT PUSHES', 12, '#A9B6AE', 'letter-spacing="1"');
    if (!data.recent.length) body += t(24, 378, 'No public pushes available');
    for (const [i, repo] of data.recent.entries()) {
      body += t(24, 378 + i * 33, repo.name.length > 23 ? `${repo.name.slice(0, 22)}…` : repo.name, 15, '#F2F0E7');
      body += t(396, 378 + i * 33, repo.pushed_at.slice(0, 10), 12, '#A9B6AE', 'text-anchor="end"');
    }
  }
  const width = mobile ? 420 : 1000, height = mobile ? 472 : 255;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Public repository activity</title>
<desc id="desc">Snapshot dated ${escapeXML(date)}. ${data.count} public, non-fork repositories excluding the profile. Primary language counts by repository: ${escapeXML(data.languages.map(([name, count]) => `${name}: ${count}`).join(', ') || 'none')}. Recent repository pushes: ${escapeXML(data.recent.map(repo => `${repo.name}, ${repo.pushed_at.slice(0, 10)}`).join('; ') || 'none')}. Push dates are not necessarily commit dates.</desc>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="6" fill="#101615" stroke="#2A3632"/>
${body}
</svg>\n`;
}

async function main() {
  const owner = process.env.PROFILE_USER || 'BineetX';
  if (!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(owner)) throw new Error('Invalid PROFILE_USER');
  const repos = await fetchRepositories(owner);
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  await mkdir(new URL('../assets/', import.meta.url), { recursive: true });
  const summary = summarize(repos, owner);
  for (const mobile of [false, true]) {
    const name = mobile ? 'activity-mobile.svg' : 'activity.svg';
    const output = new URL(`../assets/${name}`, import.meta.url);
    const temporary = new URL(`../assets/${name}.tmp`, import.meta.url);
    await writeFile(temporary, renderActivity(summary, date, mobile));
    await rename(temporary, output);
  }
  console.log(`Updated public activity for ${owner} (${date}).`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
