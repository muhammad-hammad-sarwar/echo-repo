// /app/_components/SearchBar.tsx
"use client";

import { normalizeRepoInput } from "@/utils/normalizeRepoInput";
import { useState } from "react";

type SearchBarProps = {
  onAnalyze: (owner: string, repo: string) => void;
};

export function SearchBar({ onAnalyze }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (input: string) => {
    try {
      normalizeRepoInput(input);
      return "";
    } catch (caught) {
      return caught instanceof Error
        ? caught.message
        : "Use owner/repo or a GitHub repository URL.";
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { owner, repo } = normalizeRepoInput(value);
      setError("");
      onAnalyze(owner, repo);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Use owner/repo or a GitHub repository URL.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row items-stretch">
        <label className="sr-only" htmlFor="repo-input">
          Owner slash repository
        </label>
        <input
          id="repo-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="owner/repo or github.com/owner/repo"
          className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Analyze
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
