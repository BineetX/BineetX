# Set up your GitHub profile

This package is customized for `BineetX/BineetX`. It has not been published to GitHub.

## 1. Add the files

Open https://github.com/BineetX/BineetX and work on its default branch.
The profile repository must be public, with `README.md` at the repository root.
If it does not exist, create a public repository named exactly `BineetX`.
Keep a copy of your current README before replacing it.

Upload or copy these paths, preserving their directories:

- `README.md`
- `assets/banner.svg`
- `assets/genocular.svg`
- `assets/knowledge-graph.svg`
- `assets/drug-synergy.svg`
- `.github/workflows/snake.yml`
- `.github/workflows/metrics.yml` (optional)

You can leave this `SETUP.md` out of the repository.
If using the GitHub web interface, drag the `assets` folder into Add file → Upload files.
For each workflow, use Add file → Create new file and type its complete path,
such as `.github/workflows/snake.yml`, then paste the YAML and commit.
Workflow files must be on the default branch for scheduled execution.

## 2. Start the snake

1. Open the repository's **Actions** tab.
2. Enable Actions if GitHub prompts you.
3. Select **Generate contribution snake**.
4. Click **Run workflow**, select the default branch, and run it.
5. Wait for the workflow to succeed, then refresh your profile.

The workflow reads your contribution calendar and creates light/dark SVGs.
It publishes them to a separate `output` branch. The README links already match.
The first successful run creates the images; the README snake can look broken until then.
The daily refresh is scheduled at 00:23 UTC (05:53 IST); scheduled runs may be delayed.
No personal access token and no GitHub Pages site are needed for the snake.
The built-in `GITHUB_TOKEN` is supplied automatically by GitHub Actions.

If publishing fails with a permissions error, check Settings → Actions → General
and applicable repository/organization workflow policies. The YAML already requests
`contents: write`. Also check that branch protection allows creating/updating `output`.
Never change the default branch to `output`; it holds generated images only.

## 3. Customize the banner

The default header uses Capsule Render with a navy → teal → violet gradient.
Change these URL parameters in `README.md`:

| Parameter | Current purpose |
| --- | --- |
| `text` | Your displayed name; encode spaces as `%20` |
| `desc` | Short description |
| `color` | Gradient stops: `0:0F172A,55:0F766E,100:7C3AED` |
| `fontSize` | Name size |
| `height` | Banner height |
| `type` | Shape, currently `waving` |
| `animation` | Name appearance, currently `fadeIn` |

In HTML image URLs, retain `&amp;` between parameters.
Use https://capsule-render.vercel.app to experiment with the generator.
Capsule Render is an external service whose availability can vary.
For a custom banner stored in your own repo, replace the first `<img>` with:

```html
<img src="assets/banner.svg" width="100%" alt="Bineet Kumar Mohanta — computational biology and bioinformatics" />
```

The included SVG is a static scientific network design that does not depend on an external banner service.

## 4. Complete the project showcase

The project names and summaries are starting points for your existing work.
No repository names, demos, publication URLs, or awards have been invented.
Search `README.md` for `_URL`, fill in the real links, then uncomment those blocks.
Update descriptions and project maturity to reflect their current state.
The three SVGs are illustrative covers, not screenshots or results.
Replace a cover with an actual interface screenshot or a small GIF when available.
Do not rename an asset without updating its README path.

## 5. Badges and achievements

There are three different kinds:

1. **Native GitHub achievements:** GitHub awards these for qualifying events and
   displays them in your profile sidebar. They are not enabled by README code.
   Review Settings → Public profile → Contributions & Activity to manage visibility.
2. **Your own awards, publications, and certificates:** use linked Shields.io badges.
   Uncomment the Selected achievements template after adding genuine details.
3. **Automated activity highlights:** the optional Metrics workflow creates its own
   third-party achievement panel. These are separate from GitHub's native badges.

A custom badge has this structure:

```markdown
[![Award](https://img.shields.io/badge/Award-YOUR_AWARD_NAME-D97706?style=flat-square)](YOUR_EVIDENCE_URL)
```

Use underscores or URL-encoded spaces in the badge's label/message. Link to a paper,
award announcement, credential verification, or another relevant evidence page.
Other useful project badges include release version, DOI, license, CI, and documentation.
Add each only when it reflects the actual repository.

## 6. Optional activity, 3D calendar, and achievements panel

This part needs a personal access token for reading public account information.

1. In your account Settings → Developer settings → Personal access tokens → Tokens
   (classic), generate a token with an expiry and **no scopes selected** for this public-data setup.
   Copy it once. The Metrics documentation supports scopeless tokens for these features.
2. In `BineetX/BineetX`, open Settings → Secrets and variables → Actions.
3. Add a repository secret named exactly `METRICS_TOKEN` and paste the token as its value.
   Keep the token out of the README and YAML; both use the secret reference.
4. Add `.github/workflows/metrics.yml` from this package to the default branch.
5. In Actions, manually run **Generate profile metrics** and wait for completion.
6. Confirm that `github-metrics.svg` and `github-achievements.svg` exist at the root
   of your default branch. Only then uncomment the GitHub highlights block in `README.md`.

The built-in `GITHUB_TOKEN` commits the SVGs; the scopeless `METRICS_TOKEN` reads
public account data. The optional workflow skips its steps if the secret is absent.
Renew the secret when the personal token expires.
The panel shows available activity highlights; sparse activity can produce a small panel.
`plugin_achievements_threshold: C` avoids intentionally displaying locked achievements.
It does not represent scientific awards or a validated assessment of expertise.

## 7. Finish the profile

- Keep only Skill Icons for tools you actually use.
- Add your real ORCID, Google Scholar, LinkedIn, and contact links in the commented block.
- Pin your best repositories via Customize your pins on your profile (up to six items).
- Put a screenshot, purpose, quick start, and documentation in each project's README.
- A repository social-preview image is configured separately under Settings → Social preview.
- View your profile in both light and dark themes and on a narrow screen.

## References

- Profile README: https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme
- Native badges and achievements: https://docs.github.com/en/account-and-profile/reference/profile-reference
- Capsule Render: https://github.com/kyechan99/capsule-render
- Typing SVG: https://github.com/DenverCoder1/readme-typing-svg
- Skill Icons: https://github.com/tandpfun/skill-icons
- Shields.io: https://shields.io/
- Snake action: https://github.com/Platane/snk
- Upstream snake publishing example: https://github.com/Platane/Platane/blob/master/.github/workflows/main.yml
- Metrics setup: https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md
- Metrics achievements: https://github.com/lowlighter/metrics/blob/master/source/plugins/achievements/README.md

## Validation

README links and asset paths, SVG XML, workflow YAML, and ZIP contents were checked locally.
The workflows have not been run against your GitHub account; their first run happens after upload.
