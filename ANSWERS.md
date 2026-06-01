# Engineering Notes

## 1. How to run

```bash
git clone <repo-url>
cd echorepo
npm install
npm run dev
```

## 2. Stack choice

Next.js App Router with React and TypeScript is used for a fast, typed frontend. Tailwind CSS handles styling, and Axios manages GitHub API requests and errors. Plain JavaScript would be a worse choice due to weaker type safety and more complex error handling.

## 3. One real edge case

Input normalization for GitHub URLs is handled in `/utils/normalizeRepoInput.ts`. Without this normalization, users entering `https://github.com/owner/repo` or `github.com/owner/repo/` would fail validation and the app would reject valid repository identifiers. This edge case matters because GitHub URL parsing needs to strip protocol, domain, and trailing slashes while preserving owner and repo segments.

## 4. AI usage

AI was used during development for UI structuring, code generation drafts, and to explore approaches for input normalization and GitHub URL parsing.

The generated output was not used directly. It was modified to enforce stricter validation, support multiple input formats (owner/repo and full GitHub URLs), and handle edge cases such as empty input, malformed URLs, and trailing slashes.

## 5. Honest gap

This feature performs client-side normalization for common GitHub URL formats. It is designed for practical use cases and does not handle all possible URL edge cases or replace backend-level validation.
