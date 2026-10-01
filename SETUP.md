# Maintaining this profile

The README is a Markdown portfolio with repository-owned SVG artwork. Project
names appear on compact covers; descriptions and links stay in `README.md`.

## Edit or add projects

Edit the project descriptions directly in `README.md`. The comments below
GemeMiom and MyoCircBase mark where to add their descriptions. End a description line with a backslash if you want the links on the next line.

To add another project, insert this before the research section:

```markdown
#### Project name

A short description of what the project does.\
[Website ↗](https://example.org) · [Source ↗](https://github.com/BineetX/REPOSITORY)
```

A cover is optional. To create one matching the current set, add an entry to the
`projects` array in `scripts/build-artwork.mjs`, add the generated filename to the
workflow's `git add` list, and run:

```sh
node scripts/build-artwork.mjs
```

Use the cover in place of the heading: `[![Project name](assets/name.svg)](URL)`.
The artwork generator never edits the README or your project descriptions.
GENOCULAR, GemeMiom, and MyoCircBase use the URLs supplied by the profile owner.

## Motion and interaction

The original [Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg)
integration is restored beneath the header. Change `lines=` in both image URLs
in `README.md` to edit its phrases; separate phrases with semicolons and encode
spaces as `+`. The text types and deletes on a loop without a workflow run.
Light and dark themes use different text colors for contrast.

The header's network rotates slowly. Each project cover has its own animated
motif. These are local SVG animations, so no external runtime or JavaScript is
needed for the artwork. They respect the viewer's reduced-motion preference.
The remotely hosted typing animation and snake retain their upstream behavior.

Project covers and launch/source links open the supplied destinations. Native
`details` controls expand the real GENOCULAR and GemeMiom screenshots, the full
toolkit, and the repository snapshot. Keep `assets/project_screenshots/` with the
README when publishing. The contribution animation is visible by default.

The typing line and [Skill Icons](https://github.com/tandpfun/skill-icons) are
hosted integrations and require those services to be available. The daily
repository snapshot and contribution-generation workflow are preserved.

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
expandable interface previews use the screenshots in `assets/project_screenshots/`.

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
`#7DD3FC`, with per-project indigo and teal accents. Local artwork has accessible
descriptions and mobile variants. Keep project descriptions in Markdown when
extending the portfolio.
