'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthMutations } from "@/services/auth";
import { print } from "@/utils/toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginDto } from '@/api-client/api';


const LoginPage = () => {
  const { login } = useAuthMutations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>();

  const onSubmit = (data: LoginDto) => {
    login.mutate(data, {
      onSuccess: (res) => {
        print(`Welcome, ${res.user.email}`, "success");
        // router.push("/dashboard");
      },
      onError: (err) => {
        print("Login failed: " + (err?.message || "Unknown error"), "error");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-100">
            <div className="px-8 py-6 text-white bg-gradient-to-r from-indigo-600 to-indigo-400">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-indigo-100 mt-1">Sign in to your account</p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white px-8 py-6"
            >
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input w-full px-4 py-3 rounded-lg border border-gray-300"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  className="form-input w-full px-4 py-3 rounded-lg border border-gray-300"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50"
                >
                  <span className="mr-2">🔵</span> Google
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50"
                >
                  <span className="mr-2">🔵</span> Facebook
                </button>
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Haven’t registered yet?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Create an account
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
