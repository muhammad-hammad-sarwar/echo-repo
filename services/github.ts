import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
  timeout: 10000,
});

const VALID_SEGMENT = /^[a-zA-Z0-9_.-]+$/;

const validateRepoParams = (owner: string, repo: string) => {
  const ownerTrimmed = owner.trim();
  const repoTrimmed = repo.trim();

  if (!ownerTrimmed || !repoTrimmed) {
    throw new Error("Repository parameters must include both owner and repo.");
  }
  if (!VALID_SEGMENT.test(ownerTrimmed) || !VALID_SEGMENT.test(repoTrimmed)) {
    throw new Error(
      "Repository owner and name must use only letters, numbers, dots, dashes, or underscores.",
    );
  }
};

type RepoOwner = {
  login: string;
  avatarUrl: string;
  url: string;
};

type RepoData = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  license: string | null;
  createdAt: string;
  updatedAt: string;
  defaultBranch: string;
  owner: RepoOwner;
};

type ContributorData = {
  id: number;
  login: string;
  avatarUrl: string;
  url: string;
  contributions: number;
};

type CommitData = {
  sha: string;
  message: string;
  authorName: string | null;
  authorEmail: string | null;
  authorLogin: string | null;
  date: string;
  url: string;
};

const isRateLimitError = (
  message: string,
  headers?: Record<string, string | undefined>,
) => headers?.["x-ratelimit-remaining"] === "0" || /rate limit/i.test(message);

const handleGitHubError = (
  error: unknown,
  owner: string,
  repo: string,
): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = String(
      error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred.",
    );

    if (!error.response) {
      throw new Error(
        "Network error: unable to reach GitHub. Check your connection and try again.",
      );
    }

    if (status === 404) {
      throw new Error(
        "Repository not found. Confirm the owner/repo name and try again.",
      );
    }

    if (status === 403) {
      if (
        isRateLimitError(
          message,
          error.response.headers as Record<string, string | undefined>,
        )
      ) {
        throw new Error(
          "GitHub rate limit exceeded. Please wait and try again later.",
        );
      }
      throw new Error("Access to the GitHub repository is forbidden.");
    }

    if (status >= 500) {
      throw new Error(
        "GitHub is currently unavailable. Please try again later.",
      );
    }

    throw new Error(`GitHub API error: ${message}`);
  }

  throw new Error(
    "Network error while fetching GitHub data. Please check your connection.",
  );
};

export const fetchRepo = async (
  owner: string,
  repo: string,
): Promise<RepoData> => {
  validateRepoParams(owner, repo);

  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      watchers: data.watchers_count,
      language: data.language,
      license: data.license?.name ?? null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      defaultBranch: data.default_branch,
      owner: {
        login: data.owner.login,
        avatarUrl: data.owner.avatar_url,
        url: data.owner.html_url,
      },
    };
  } catch (error) {
    handleGitHubError(error, owner, repo);
  }
};

export const fetchContributors = async (
  owner: string,
  repo: string,
): Promise<ContributorData[]> => {
  validateRepoParams(owner, repo);

  try {
    const response = await githubApi.get(
      `/repos/${owner}/${repo}/contributors`,
      {
        params: { per_page: 100 },
      },
    );

    return response.data.map((contributor: any) => ({
      id: contributor.id,
      login: contributor.login,
      avatarUrl: contributor.avatar_url,
      url: contributor.html_url,
      contributions: contributor.contributions,
    }));
  } catch (error) {
    handleGitHubError(error, owner, repo);
  }
};

export const fetchCommits = async (
  owner: string,
  repo: string,
): Promise<CommitData[]> => {
  validateRepoParams(owner, repo);

  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: 100 },
    });

    return response.data.map((commitItem: any) => ({
      sha: commitItem.sha,
      message: commitItem.commit.message,
      authorName: commitItem.commit.author?.name ?? null,
      authorEmail: commitItem.commit.author?.email ?? null,
      authorLogin: commitItem.author?.login ?? null,
      date: commitItem.commit.author?.date,
      url: commitItem.html_url,
    }));
  } catch (error) {
    handleGitHubError(error, owner, repo);
  }
};
