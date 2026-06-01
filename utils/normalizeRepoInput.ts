export type NormalizedRepoInput = {
  owner: string;
  repo: string;
};

const SEGMENT_PATTERN = /^[a-zA-Z0-9_.-]+$/;
const GITHUB_HOST_PATTERN = /^github\.com$/i;

export function normalizeRepoInput(input: string): NormalizedRepoInput {
  const trimmed = input.trim().replace(/\/+$/g, "");
  if (!trimmed) {
    throw new Error("Repository identifier is required.");
  }

  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  if (GITHUB_HOST_PATTERN.test(withoutProtocol)) {
    throw new Error("Repository URL must include owner and repo.");
  }

  const withoutHost = withoutProtocol.replace(/^github\.com\//i, "");
  const parts = withoutHost.split("/").filter(Boolean);

  if (parts.length !== 2) {
    throw new Error("Use owner/repo or a full GitHub repository URL.");
  }

  const [owner, repo] = parts;
  if (!SEGMENT_PATTERN.test(owner) || !SEGMENT_PATTERN.test(repo)) {
    throw new Error(
      "Repository owner and name must use letters, numbers, dots, dashes, or underscores.",
    );
  }

  return { owner, repo };
}
