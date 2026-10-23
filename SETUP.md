# Maintaining this profile

The README uses repository-owned SVG artwork. Sections run in this order:
Research, Skills, Activity, Projects. The final section is a compact two-column,
four-card dashboard built with GitHub-compatible HTML table markup.

## Edit or add projects

Edit destinations and accessible descriptions in the final table in `README.md`.
Cards have equal dimensions, compact screenshot thumbnails or decorative artwork,
and short destination links. GENOCULAR and GeMemiOM open their original PNGs;
MyoCircBase and Bioinformatica open their repositories. Keep the stable anchors.

Edit `scripts/build-project-grid.mjs` to change the card artwork. Add new entries
to its projects array and matching table cells to the README, two cells per row.
Set `preview: true` only when the project has a corresponding preview WebP.
The workflow stages all generated SVGs in `assets/projects/`. Run:

```sh
node scripts/build-artwork.mjs
```

Original PNGs and compressed preview WebPs stay in `assets/project_screenshots/`.
The cards crop previews to fit their thumbnail frames; full screenshots remain
available by selecting the image. Mobile artwork keeps titles readable in the
two-column layout. Reduced-motion picture sources select static alternatives.
Only project names are drawn as visible card text; longer descriptions belong
in accessible image text. The generator never edits the README.

The previous full-width showcase assets and their generator are retained for
existing direct links, but the README now uses `assets/projects/`.

## Specialization and skills

The specialization, research summary, and skill groups are adapted from
[bineet.dev](https://bineet.dev), consulted on 13 October 2026. The site's
specialization is mathematical modelling, programming, and machine learning;
its current research focus is heterogeneous GNNs for drug synergy prediction.
The README groups the published skills and normalizes spelling, without copying
the site's proficiency percentages. Review the live portfolio before updating
these details. This content is maintained manually, not by the daily workflow.
Nginx, PostgreSQL, MinIO, Redis, Keycloak, AWS, and Firebase expertise was
confirmed by the profile owner. Cloud services and data storage have separate
rows in the expandable toolkit. The opening specialization table and repeated
research descriptions were consolidated into the research section and toolkit.

## Motion and interaction

The banner includes scientific software development and mathematical modeling,
with two rows of specialties on desktop and three lines on mobile. The centered
affiliation uses a larger native heading with the institution on its own line. Five centered
navigation buttons use artwork from `scripts/build-navigation.mjs`, native
section links, and a portfolio link. Edit destinations in `README.md`; the main
build and refresh workflow include `assets/navigation/` automatically.

Six social buttons below the introduction link to LinkedIn, Google Scholar,
ORCID, ResearchGate, X/Twitter, and Bioinformatica on YouTube. Each is a separate
native anchor with an accessible image name and a hover title. The icon buttons
have slowly moving border highlights; reduced-motion sources use static SVGs.
They wrap into two rows on phones without custom page CSS or JavaScript.
GitHub does not pass pointer events into embedded SVG images, so the interaction
uses native links, tooltips, and keyboard focus instead of simulated hover effects.

Edit the destinations in `README.md` and the artwork in `scripts/build-socials.mjs`.
The main artwork build imports this generator. Brand paths are vendored from
Simple Icons; provenance and the CC0 license reference are in
`assets/social-logos/sources.json`. The destinations come from the owner's
portfolio and GitHub profile; ORCID uses its public identifier URL.

The research panel uses a moving graph constellation with travelling edge
signals, a pulsing drug-combination matrix with a scanning highlight, and a
progressively drawn response curve with a moving tracer. All three are
conceptual illustrations, not experimental measurements. Edit
`scripts/build-research.mjs`; it is imported by `scripts/build-artwork.mjs` and
can also run independently with `node scripts/build-research.mjs`.
Desktop uses three columns; mobile stacks the full diagrams vertically.
The SVGs contain only local vector shapes and CSS animation, with no JavaScript
or external dependencies. The README uses `research-motion.svg` and its mobile
variant. Their new filenames avoid reusing older cached image responses.
Reduced-motion picture sources select `research-motion-still.svg` and
`research-motion-mobile-still.svg`; there is no visible still-view link.
The diagrams retain only their three titles. Explanations and the conceptual
illustration note live in accessible image descriptions, not visible captions.
Normal motion is visible in the live GitHub image test; system/browser
reduced-motion preferences intentionally select the static variants.

The skills panel has two seamless, right-to-left logo rows with soft edge fades.
All 34 logos are embedded in the generated SVGs, so there is no icon-service
request at viewing time. Edit `scripts/build-skills.mjs` to update the selection;
`node scripts/build-artwork.mjs` rebuilds everything offline. Original logos and
their source URLs are in `assets/skill-logos/`, alongside the Skill Icons license.
The mobile panel keeps icons legible instead of shrinking the desktop strip.
Reduced-motion picture sources show every logo in a static grid.
`DGL-small.png` is a 208-pixel-wide thumbnail of the original `DGL.jpg`;
embedding the thumbnail keeps the generated strips small. Broad research
methods and unbranded scientific packages remain in the written toolkit.

The header's network rotates slowly. Each project cover has its own animated
motif. These are local SVG animations, so no external runtime or JavaScript is
needed for the artwork. They respect the viewer's reduced-motion preference.
The contribution snake retains its upstream behavior. The rotating typing text
has been removed to let the artwork carry the motion. Soft ambient lighting,
rounded frames, and fine top-edge highlights tie the local panels together.

Screenshot cards open the originals; other cards open their repositories.
Website/source links open the supplied destinations. Native `details` controls expand the skills table and repository snapshot. Screenshots and the logo
strip remain visible; the detailed skills table expands on demand. Keep `assets/project_screenshots/` with
the README when publishing. GitHub README interaction uses links, anchors, and
disclosures; custom JavaScript galleries and hover controls are not supported.
The contribution animation is visible by default.

The daily repository snapshot and contribution-generation workflow are preserved.

## GitHub image delivery

README image `src` and `srcset` URLs use
`https://cdn.jsdelivr.net/gh/BineetX/BineetX@main/assets/`. GitHub proxies these
external images through Camo. Relative image URLs redirect visitors directly
to `raw.githubusercontent.com`, which timed out during live-profile checks
even though the README and Actions runs loaded successfully.

Keep artwork checked into `assets/` and use the same CDN prefix for new images,
including mobile and reduced-motion sources. Screenshot destination links can
remain relative. The CDN follows the public `main` branch; caches may delay
new artwork appearing. Local artwork generation still works offline. An HTML
preview with local image URLs alone does not verify GitHub delivery: check the
public image responses and GitHub-rendered image URLs too.

## Automatic refresh

Commit the README, assets, scripts, and `.github/workflows` to the default branch
of the public `BineetX/BineetX` repository. Open **Actions → Refresh profile
visuals → Run workflow** for an immediate refresh. Pushing changes to the scripts
or this workflow also triggers it.

The workflow runs daily at **05:53 India time (00:23 UTC)**. It:

1. Checks the activity generator and rebuilds the vector artwork.
2. Reads the public GitHub repository API to regenerate `assets/activity.svg`.
3. Uses [Platane/snk](https://github.com/Platane/snk) to generate contribution
   animations in matching light and dark palettes.
4. Commits changed assets to the default branch with the built-in `GITHUB_TOKEN`.

No personal token, hosted stats service, or GitHub Pages deployment is needed for
this workflow. The checked-in assets render before the first scheduled run.
GitHub can delay scheduled jobs or disable them for inactive public repositories.
If a push is rejected, check repository rules for bot commits; the workflow
already requests `contents: write`. It never force-pushes.

The old standalone snake workflow is replaced by this consolidated workflow.
The existing `output` branch is no longer used and does not need to be removed.

## What the activity panel measures

The panel uses the [public repository endpoint](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user).
It follows pagination and excludes forks, private repositories, and the profile
repository. Language counts use the primary language of each repository, not
lines of code or proficiency. Repositories with no primary language contribute
to the total but not to the language bars. Recent pushes exclude archived
repositories and show GitHub's `pushed_at` date, which is not a commit count.
The displayed refresh date uses `Asia/Kolkata`.

A failed API request fails the refresh and leaves the checked-in panel intact.
Project cover illustrations are decorative, not experimental results. The
visible interface previews use the screenshots in `assets/project_screenshots/`.

## Optional Metrics plugins

`.github/workflows/metrics.yml` preserves the optional
[lowlighter/metrics](https://github.com/lowlighter/metrics) integration, including
languages, an isometric contribution calendar, and activity achievements.
It runs only when manually dispatched and skips generation without a token.
These supplementary panels are not part of the main README layout.

To use it, follow the upstream [token setup instructions](https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md),
add a `METRICS_TOKEN` repository secret, and run **Optional profile insights**.
For this public-data configuration, upstream documents a classic token with no
scopes. The built-in token handles committing; the personal token reads metrics.
After the workflow creates the files, you can add this to the README:

```markdown
<details>
<summary>More GitHub insights</summary>

![Activity, languages, and contribution calendar](github-metrics.svg)
![Activity achievements](github-achievements.svg)

</details>
```

These activity achievements are not GitHub's native profile achievements or
scientific awards. The main profile works without this optional integration.

## Local checks

Requires Node.js 22 or newer; the profile scripts have no npm dependencies.

```sh
node scripts/build-artwork.mjs
node --test scripts/update-activity.test.mjs
node scripts/update-activity.mjs
```

The last command needs access to `api.github.com`. `PROFILE_USER` defaults to
`BineetX`; `GITHUB_TOKEN` is optional locally and raises the API rate limit.
Action revisions are pinned in the workflows; update them deliberately.

The visual system uses GitHub charcoal `#0D1117`, white `#F0F6FC`, and cyan
`#7DD3FC`, shared across all project covers. Local artwork has accessible
descriptions and mobile variants. Keep project descriptions in Markdown when
extending the portfolio.
