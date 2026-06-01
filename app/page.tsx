"use client";

import { fetchCommits, fetchContributors, fetchRepo } from "@/services/github";
import { calculateHealthScore } from "@/utils/calculateHealthScore";
import { useCallback, useState } from "react";
import { RepoDashboard } from "./_components/RepoDashboard";
import { SearchBar } from "./_components/SearchBar";

export type RepoViewModel = {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  issues: number;
  openIssuesCount: number;
  pushedAt: string;
};

type UseRepoResult = {
  repo: RepoViewModel | null;
  healthScore: number;
  loading: boolean;
  error: string | null;
  analyze: (owner: string, repo: string) => Promise<void>;
};

function useRepo(): UseRepoResult {
  const [repo, setRepo] = useState<RepoViewModel | null>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (owner: string, repoName: string) => {
    setLoading(true);
    setError(null);

    try {
      const [repoData, contributors, commits] = await Promise.all([
        fetchRepo(owner, repoName),
        fetchContributors(owner, repoName),
        fetchCommits(owner, repoName),
      ]);

      const normalizedRepo: RepoViewModel = {
        name: repoData.fullName,
        description: repoData.description,
        stars: repoData.stars,
        forks: repoData.forks,
        issues: repoData.openIssues,
        openIssuesCount: repoData.openIssues,
        pushedAt: repoData.updatedAt,
      };

      setRepo(normalizedRepo);
      setHealthScore(
        calculateHealthScore(
          {
            openIssuesCount: normalizedRepo.openIssuesCount,
            pushedAt: normalizedRepo.pushedAt,
            updatedAt: normalizedRepo.pushedAt,
          },
          contributors.length,
          commits.slice(0, 30),
        ),
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load repository data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { repo, healthScore, loading, error, analyze };
}

export default function HomePage() {
  const { repo, healthScore, loading, error, analyze } = useRepo();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">GitHub Repository Health</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter an owner/repo identifier and analyze repository state,
            activity, and health.
          </p>
          <div className="mt-6">
            <SearchBar onAnalyze={analyze} />
          </div>
        </section>

        <RepoDashboard
          repo={repo}
          healthScore={healthScore}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
