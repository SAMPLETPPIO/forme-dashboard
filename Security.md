# Security Note

This repository's commit history was reset on [6thAugust2026] after a security review.

**What happened:** an early commit accidentally included a real database
password in a tracked environment file (`.evn`, a typo of `.env`), instead
of a sanitized example file. This went unnoticed for a period during
early development.

**What I did:**
1. Identified the exposed credential during a manual security review of the repo.
2. Rotated the live PostgreSQL password immediately, verified the running
   application reconnected correctly with zero data loss.
3. Fixed `.gitignore` to properly exclude all env files going forward.
4. Added a genuinely sanitized `.env.example` with placeholder values only.
5. Reset the git history to fully remove the leaked credential from every
   past commit, rather than relying on the file being deleted going forward.

**Why the history reset instead of `git filter-repo`:** with zero external
forks or clones of this repository at the time, a clean history reset was
the fastest way to guarantee the credential could never be recovered from
any commit, reflog, or cached clone.

This is documented here for transparency, and as a reminder to always
gitignore environment files before the first commit, not after.
