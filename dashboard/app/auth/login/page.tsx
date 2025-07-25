"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, ArrowLeft, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from '@/app/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: formData.email, password: formData.password });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="min-h-screen flex">
        {/* Left Banner */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="w-16 h-16 mb-6 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome Back to BlockSecure
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Access your decentralized insurance dashboard and manage your
                policies with blockchain security.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Transparent</h3>
                  <p className="text-emerald-100 text-sm">
                    All transactions recorded on blockchain
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Payouts</h3>
                  <p className="text-emerald-100 text-sm">
                    Smart contracts enable automatic claims
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Global Coverage</h3>
                  <p className="text-emerald-100 text-sm">
                    Worldwide protection 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span>Trusted by</span>
                <span className="font-bold">50,000+ users</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 group mb-8 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>

              <div className="lg:hidden mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-400">
                Sign in to your BlockSecure account
              </p>
            </div>

            {/* Login Form */}
            <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">
                  Sign In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter your password"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            rememberMe: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-slate-400"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 py-3"
                  >
                    Sign In
                  </Button>
                  {loginError && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      {loginError || "Login failed"}
                    </p>
                  )}
                </form>

                <div className="mt-6 text-center">
                  <p className="text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="text-center mt-6">
              <p className="text-xs text-slate-500">
                Protected by blockchain security and end-to-end encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
