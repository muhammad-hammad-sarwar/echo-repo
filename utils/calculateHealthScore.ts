export type RepoMetrics = {
  openIssuesCount: number;
  pushedAt: string;
  updatedAt: string;
  createdAt?: string;
  archived?: boolean;
  disabled?: boolean;
};

export type CommitMetric = {
  sha: string;
  date: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const daysBetween = (from: Date, to: Date) =>
  Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86400000));

const recentActivityScore = (pushedAt: string, now: Date) => {
  const lastPush = new Date(pushedAt);
  const ageDays = daysBetween(lastPush, now);

  if (ageDays <= 7) return 30;
  if (ageDays <= 30) return 22;
  if (ageDays <= 90) return 12;
  if (ageDays <= 180) return 5;
  return 0;
};

const commitRecencyScore = (commits: CommitMetric[], now: Date) => {
  if (!commits.length) return -20;

  const recentCount = commits.filter((commit) => {
    const commitDate = new Date(commit.date);
    return daysBetween(commitDate, now) <= 30;
  }).length;

  return clamp(Math.round((recentCount / 30) * 30), 0, 30);
};

const contributorDiversityScore = (contributorsCount: number) => {
  if (contributorsCount <= 0) return 0;
  if (contributorsCount === 1) return 5;
  if (contributorsCount <= 3) return 12;
  if (contributorsCount <= 10) return 20;
  return 25;
};

const issueBacklogPenalty = (
  openIssuesCount: number,
  contributorsCount: number,
) => {
  const ratio = openIssuesCount / Math.max(1, contributorsCount);
  if (ratio <= 1) return 0;
  if (ratio <= 3) return -8;
  if (ratio <= 6) return -16;
  return -25;
};

export const calculateHealthScore = (
  repo: RepoMetrics,
  contributorsCount: number,
  commits: CommitMetric[],
): number => {
  if (repo.archived || repo.disabled) return 0;

  const now = new Date();
  const base = 35;
  const activity = recentActivityScore(repo.pushedAt, now);
  const commitRecency = commitRecencyScore(commits, now);
  const diversity = contributorDiversityScore(contributorsCount);
  const backlog = issueBacklogPenalty(repo.openIssuesCount, contributorsCount);

  return clamp(base + activity + commitRecency + diversity + backlog, 0, 100);
};
