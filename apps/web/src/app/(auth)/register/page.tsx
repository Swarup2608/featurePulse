"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { ApiError } from "@/lib/api/api-error";
import { authService } from "@/lib/api/auth.service";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth.validation";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);

      const authData = await authService.register(data);

      setAuth(authData.user, authData.organization);

      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — PRODUCT MESSAGE */}
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%)]" />

          <div className="relative">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
                F
              </div>

              <span className="text-xl font-semibold">FeaturePulse</span>
            </Link>
          </div>

          <div className="relative max-w-md">
            <p className="mb-6 text-sm font-medium tracking-wide text-zinc-500">
              BUILD BETTER PRODUCTS
            </p>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              See which features actually matter.
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              FeaturePulse helps engineering and product teams understand
              feature adoption through meaningful event intelligence.
            </p>

            <div className="mt-10 space-y-5">
              <FeaturePoint>Create and manage product features</FeaturePoint>

              <FeaturePoint>Track real user interactions</FeaturePoint>

              <FeaturePoint>Turn events into product insights</FeaturePoint>
            </div>
          </div>

          <div className="relative text-sm text-zinc-500">
            Start with your first workspace.
          </div>
        </section>

        {/* RIGHT — REGISTER FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
                F
              </div>

              <span className="text-xl font-semibold">FeaturePulse</span>
            </Link>

            <div>
              <p className="text-sm text-zinc-500">Create your workspace</p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Start building with clarity.
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Create an account and start understanding how users interact
                with your product.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {serverError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {serverError}
                </div>
              )}

              {/* NAME */}
              <FormField label="Your name" error={errors.name?.message}>
                <div className="relative">
                  <UserPlus
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    placeholder="Swarup"
                    autoComplete="name"
                    {...register("name")}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>
              </FormField>

              {/* ORGANIZATION */}
              <FormField
                label="Organization name"
                error={errors.organizationName?.message}
              >
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    placeholder="Acme Inc."
                    autoComplete="organization"
                    {...register("organizationName")}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>
              </FormField>

              {/* EMAIL */}
              <FormField label="Email address" error={errors.email?.message}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register("email")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.06]"
                />
              </FormField>

              {/* PASSWORD */}
              <FormField label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    {...register("password")}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-12 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormField>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  <>
                    Create workspace
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-white transition hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">{label}</label>

      {children}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function FeaturePoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <div className="h-1.5 w-1.5 rounded-full bg-white" />

      {children}
    </div>
  );
}
