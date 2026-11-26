# Engineering and content rules

These are the organization's standing rules for any project. They apply to code, content, commit history, and the output of this skill itself.

## Rule 1: Never make assumptions

Do not fill gaps with guesses. Derive facts from the repository, the served site, configuration files, and what the user states. When a decision or a fix needs information that none of those sources provide, ask for it rather than inventing a value.

Operationally, this means:

- Never insert a fabricated brand name, domain, locale, contact detail, social URL, or analytics ID into a file and treat it as real.
- When detection is uncertain (for example a framework injects head tags at build time, so the raw source shows no `<title>`), record the item as needing review and state what to confirm. Do not assert it is missing.
- When the correct fix depends on a business fact (is this a local business? which locales are targeted?), confirm the fact first.
- Placeholders are acceptable only inside clearly marked templates, never in a file that is meant to ship.

## Rule 2: Never use the em dash

Do not use the em dash character (Unicode U+2014) anywhere: not in code, comments, documentation, commit messages, site content, or the files this skill produces.

Use one of these instead, chosen to fit the grammar:

- A comma, when joining two related clauses.
- A colon, when introducing a list or an explanation.
- Parentheses, for an aside.
- A reworded sentence, when none of the above reads cleanly.
- A spaced hyphen, only as a last resort.

When auditing an existing site, treat every em dash already present as a defect to fix. The en dash (U+2013) and a double hyphen used as a dash are advisory: flag them for review, but the em dash is the hard violation.

## Rule 3: Always keep .gitignore and README.md up to date

Every project must carry a current `.gitignore` and a current `README.md`, and every change that affects either must update it in the same work.

- `.gitignore` must always include the organization standard categories (see `git_policy.md` and `gitignore_standard.txt`). Project specific entries are added on top; the required security, secret, temporary, IDE, AI tooling, and generated file exclusions are never removed.
- `README.md` must reflect the current project: name, description, prerequisites, setup, how to run and build, environment variables (pointing at `.env.example`, never real secrets), and any newly added top level files.

This skill enforces Rule 3 as a mandatory final step on every fix run, even when the user only asked for something else.

## Rule 4: Never change existing UI/UX

When fixing gaps or scaffolding new pages and files, preserve every existing visual and interaction decision in the project. This rule is binding on every fix run, even when the user does not mention it.

Operationally, this means:

- Do not alter font families, font sizes, font weights, or line heights already in the project's stylesheet.
- Do not alter color values, color tokens, or CSS custom properties already defined.
- Do not alter spacing, padding, margin, border radius, shadow, or layout rules already in the project.
- Do not alter the visual hierarchy, section order, or navigation structure already present.
- New pages (privacy policy, custom 404, offline fallback, or any other page created during a fix run) must inherit the project's existing design system. Read the project's CSS, design tokens, or component library first, then apply those same tokens to the new page.
- If no design system is detectable (for example a brand new project with no stylesheet yet), use the bundled template defaults from `assets/` without inventing a new visual style. Note in `fix_summary.md` that the template defaults were used and that the user should update the tokens to match their final design.
- Never swap the project's chosen framework component or icon system for a different one, even if the alternative seems more convenient.

This rule also applies to the files this skill itself produces (`gap_identification.md`, `fix_summary.md`): do not change the structure or layout of a report that was already presented to the user unless the user asks for edits.

## A note on emojis

Per the website criteria, shipped site content uses icons rather than emojis. When replacing an emoji, map it to an equivalent icon in the project's existing icon system rather than deleting meaning or adding a new dependency for a single glyph.
