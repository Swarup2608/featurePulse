"use client";

import { useState } from "react";

import { ArrowRight, FolderPlus, Loader2, X } from "lucide-react";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => Promise<void>;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Project name must contain at least 2 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onCreate({
        name: name.trim(),
        description: description.trim(),
      });

      setName("");
      setDescription("");

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-950/40 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        {/* Decorative glow */}
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-200/50 blur-3xl" />

        <div className="relative border-b border-zinc-100 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg">
                <FolderPlus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                  Create a project
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Start tracking your product features.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5 p-6">
          <div>
            <label
              htmlFor="project-name"
              className="text-sm font-semibold text-zinc-800"
            >
              Project name
            </label>

            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. FeaturePulse Web"
              autoFocus
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 disabled:bg-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="text-sm font-semibold text-zinc-800"
            >
              Description
              <span className="ml-1 font-normal text-zinc-400">Optional</span>
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this project about?"
              rows={4}
              disabled={isSubmitting}
              className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 disabled:bg-zinc-50"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create project
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
