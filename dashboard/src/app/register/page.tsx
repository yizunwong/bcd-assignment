"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthMutations } from "@/services/auth";
import { print } from "@/utils/toast";
import { RegisterDto } from '@/api-client/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RegisterPage = () => {
  const { register: registerMutation } = useAuthMutations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>();

  const onSubmit = (data: RegisterDto) => {
    if (data.password !== data.confirmPassword) {
      print("Passwords do not match", "error");
      return;
    }
    registerMutation.mutate(data, {
      onSuccess: () => {
        print(`Registered successfully`, "success");
        router.push("/");
      },
      onError: (err) => {
        print(
          "Registration failed: " + (err?.message || "Unknown error"),
          "error"
        );
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
              <h2 className="text-2xl font-bold">Create an account</h2>
              <p className="text-indigo-100 mt-1">Join us today</p>
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

              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Password
                </label>
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

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input w-full px-4 py-3 rounded-lg border border-gray-300"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  {isSubmitting ? "Creating account..." : "Register"}
                </button>
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Sign in
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

export default RegisterPage;
