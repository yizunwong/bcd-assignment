"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/components/shared/ToastProvider";
import { useRouter } from "next/navigation";
import GetStartedButton from "@/components/animata/button/get-started-button";
import { parseError } from "@/utils/parseError";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const { printMessage } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      printMessage("Logged in successfully", "success");
      router.push("/");
      router.refresh();
    } catch (err) {
      printMessage(parseError(err) || "Login failed", "error");
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 group mb-8 text-slate-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="lg:hidden mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-600 dark:text-slate-400">Sign in to your Coverly account</p>
      </div>
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 dark:text-white text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="form-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </Link>
            </div>
            <GetStartedButton text="Sign In" loading={isLoggingIn} />
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-6">
        <p className="text-xs text-slate-500 dark:text-slate-500">Protected by blockchain security and end-to-end encryption</p>
      </div>
    </div>
  );
}
