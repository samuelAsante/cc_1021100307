'use client';

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInData = z.infer<typeof SignInSchema>;

const InputField = ({
  label,
  register,
  error,
  type = "text",
}: {
  label: string;
  register: ReturnType<typeof useForm>["register"];
  error?: { message?: string };
  type?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...register}
      type={type}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

const Button = ({
  children,
  loading = false,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-2xl disabled:opacity-50"
  >
    {loading ? "Signing in..." : children}
  </button>
);

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(SignInSchema) });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignInData) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post("http://localhost:5000/signin", data);
      setMessage("Sign in successful! Redirecting...");
      console.log("Success:", response.data);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Sign in failed. Please try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-10 p-8  shadow-md rounded-2xl"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
      <InputField
        label="Email"
        register={register("email")}
        error={errors.email}
      />
      <InputField
        label="Password"
        register={register("password")}
        error={errors.password}
        type="password"
      />
      {message && (
        <p className="text-sm mt-2 text-center text-red-600">{message}</p>
      )}
      <Button loading={loading}>Sign In</Button>
      <p className="mt-8 text-center">Don't have an account? <a className="text-red-500" href="/register">Register</a></p>
      </form>
    </div>
  );
}
