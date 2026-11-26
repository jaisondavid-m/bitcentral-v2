# Mandatory git policy

Every repository must include a project specific `.gitignore` based on the organization standard in `gitignore_standard.txt`. Repository owners may add additional project requirements, but must not remove the security, secret, temporary, IDE, AI tooling, or generated file exclusions. Only project relevant source code should be committed.

## What this skill checks

1. A `.gitignore` exists at the repository root.
2. It contains every required category from the standard. The categories are:
   - OS generated files
   - Logs
   - Environment and secrets (with `.env.example` kept via a negation)
   - IDE and editor files
   - Node and React build output and dependencies
   - Python caches and virtual environments
   - Frappe and ERPNext generated paths (when the project uses them)
   - Docker data and image archives
   - Temporary files
   - Build artifacts
   - AI tooling and agent generated files
   - Testing output
   - Local development files
   - Miscellaneous backup files
   - Website standards auditor output (`audit_findings.json`, `gap_identification.md`, `fix_summary.md`, `media_replacements.json`, `lighthouse-report.*`): these are local working files produced by the skill during an audit or fix run. They contain project analysis and are never meant to be committed.
3. No secret bearing file is tracked by git. When git is available, the scanner runs the equivalent of `git ls-files` and flags any tracked file matching secret patterns such as `.env`, `*.pem`, `*.key`, `*.crt`, `*.p12`, `*.pfx`, `secrets.json`, `credentials.json`, or `service-account.json`. A tracked `.env.example` is allowed.

## How this skill fixes gaps

- If `.gitignore` is missing, create it from `gitignore_standard.txt` plus any stack specific additions the project needs.
- If `.gitignore` exists but lacks required categories, merge the missing lines in without removing anything the project added.
- If a secret bearing file is already tracked, stop tracking it (for example `git rm --cached <file>`), make sure the pattern is in `.gitignore`, and advise the user to rotate the exposed secret, since removing it from the working tree does not remove it from history.

The standard `.gitignore` is reconciled on every Phase 2 fix run as part of Rule 3, not only when a git related gap was the reason for the run.
