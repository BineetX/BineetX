import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchRepositories, summarize, renderActivity } from './update-activity.mjs';

test('public summary excludes forks, private repos, and the profile; counts primary languages', () => {
  const repo = (name, language, extra = {}) => ({ name, language, pushed_at: '2026-01-01T00:00:00Z', ...extra });
  const data = summarize([
    repo('BineetX', 'HTML'), repo('fork', 'Ruby', { fork: true }), repo('private', 'R', { private: true }),
    repo('older', 'Python'), repo('newer', 'Python', { pushed_at: '2026-02-01T00:00:00Z' }),
    repo('archive', 'R', { archived: true }), repo('docs', null),
  ], 'bineetx');
  assert.equal(data.count, 4);
  assert.deepEqual(data.languages, [['Python', 2], ['R', 1]]);
  assert.equal(data.recent[0].name, 'newer');
  assert.ok(data.recent.every(repo => repo.name !== 'archive'));
});

test('fetches every page and rejects errors without fabricating data', async () => {
  const pages = [];
  const repos = await fetchRepositories('BineetX', async url => {
    pages.push(url);
    return { ok: true, json: async () => pages.length === 1 ? Array.from({ length: 100 }, (_, i) => ({ name: `repo-${i}` })) : [{ name: 'last' }] };
  });
  assert.equal(repos.length, 101);
  assert.match(pages[1], /page=2$/);
  await assert.rejects(fetchRepositories('BineetX', async () => ({ ok: false, status: 403 })), /403/);
});

test('empty data and XML metacharacters remain safe to render', () => {
  const empty = renderActivity({ count: 0, languages: [], recent: [] }, '2026-10-01');
  assert.match(empty, /No language data available/);
  assert.doesNotMatch(empty, /NaN|Infinity/);
  const escaped = renderActivity({ count: 1, languages: [['A&B', 1]], recent: [{ name: '<script>', pushed_at: '2026-10-01T00:00:00Z' }] }, '2026-10-01');
  assert.match(escaped, /A&amp;B/);
  assert.doesNotMatch(escaped, /<script>/);
});
