import { RepoViewModel } from "../page";

type RepoDashboardProps = {
  repo?: RepoViewModel;
  healthScore?: number;
  loading?: boolean;
  error?: string | null;
};

export function RepoDashboard({
  repo,
  healthScore,
  loading,
  error,
}: RepoDashboardProps) {
  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-6 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-5/6 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 animate-pulse rounded bg-slate-200" />
          <div className="h-20 animate-pulse rounded bg-slate-200" />
          <div className="h-20 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-semibold">Unable to load repository data</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Select a repository to see analysis details.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{repo.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            {repo.description || "No description provided."}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-900 px-5 py-4 text-center text-white">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Health Score
          </p>
          <p className="mt-2 text-3xl font-semibold">{healthScore ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Stars</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {repo.stars}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Forks</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {repo.forks}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Open issues</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {repo.issues}
          </p>
        </div>
      </div>
    </div>
  );
}
