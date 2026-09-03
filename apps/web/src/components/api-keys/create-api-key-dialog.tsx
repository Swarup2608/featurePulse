"use client";

import { useState } from "react";
import { Plus, Loader2, X, AlertCircle, Copy, Check } from "lucide-react";
import { apiKeyService } from "@/lib/api/api-key.service";

interface CreateApiKeyDialogProps {
  organizationId: string;
  projectId: string;
  sourceId: string;
  onSuccess?: () => void;
}

export function CreateApiKeyDialog({
  organizationId,
  projectId,
  sourceId,
  onSuccess,
}: CreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Key name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiKeyService.createApiKey(
        organizationId,
        projectId,
        sourceId,
        {
          name: trimmedName,
        },
      );
      setCreatedKey(result.apiKey);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setCreatedKey(null);
      setError(null);
      setName("");
      onSuccess?.();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <Plus size={18} />
        Generate key
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">
                {createdKey ? "API key created" : "Generate API key"}
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {createdKey ? (
              <div className="space-y-4 p-6">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-950">
                        Key generated successfully!
                      </p>
                      <p className="mt-1 text-sm text-emerald-700">
                        Save it now because it will not be shown again.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-950">
                    API Key
                  </label>
                  <button
                    onClick={handleCopyKey}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{createdKey}</span>
                      {copied ? (
                        <Check size={16} className="ml-2 text-emerald-600" />
                      ) : (
                        <Copy size={16} className="ml-2 text-zinc-400" />
                      )}
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="mt-0.5 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-950">
                    Key name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    disabled={loading}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || name.trim().length < 2}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
