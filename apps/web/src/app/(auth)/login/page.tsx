"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/api/api-error";
import { authService } from "@/lib/api/auth.service";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/auth.validation";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect")?.startsWith("/")
    ? searchParams.get("redirect")!
    : "/dashboard";
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const authData = await authService.login(data);
      setAuth(authData.user, authData.organization);
      router.push(redirectPath);
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
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%)]" />
          <div className="relative">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
                F
              </div>
              <span className="text-xl font-semibold">FeaturePulse</span>
            </Link>
          </div>
          <div className="relative max-w-md">
            <p className="mb-6 text-sm font-medium text-zinc-400">
              PRODUCT INTELLIGENCE PLATFORM
            </p>
            <h1 className="text-5xl font-semibold tracking-tight">
              Understand how your users experience your features.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Track feature adoption, understand product behavior, and make
              better product decisions with real-time event intelligence.
            </p>
          </div>
          <div className="relative text-sm text-zinc-500">
            Built for modern product teams.
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-14 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
                F
              </div>
              <span className="text-xl font-semibold">FeaturePulse</span>
            </Link>
            <div>
              <p className="text-sm text-zinc-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Sign in to your workspace
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Continue monitoring your features and product activity.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
              {serverError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {serverError}
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register("email")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.06]"
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to FeaturePulse
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-zinc-500">
              New to FeaturePulse?{" "}
              <Link
                href="/register"
                className="font-medium text-white hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
