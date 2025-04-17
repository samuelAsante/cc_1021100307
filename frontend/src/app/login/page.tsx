"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod validation schema for login
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

// Reusable input field
const InputField = ({
  label,
  register,
  error,
  type = "text",
}: {
  label: string;
  register: ReturnType<ReturnType<typeof useForm>["register"]>;
  error?: { message?: string };
  type?: string;
}) => (
  <div className='mb-4'>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    <input
      {...register}
      type={type}
      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
    />
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);

// Submit button
const Button = ({
  children,
  loading = false,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <button
    type='submit'
    disabled={loading}
    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-2xl disabled:opacity-50'
  >
    {loading ? "Signing in..." : children}
  </button>
);

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(
        // "http://localhost:5000/signin"
        "https://cc-1021100307.onrender.com/signin",
        data
      );
      setMessage("Login successful! Redirecting...");
      console.log("✅ Logged in:", res.data);

      // Store the token if your backend returns one
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard or home page
      }, 1500);
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      const errorMsg =
        err.response?.data?.message || "Login failed. Try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-md w-full bg-white p-8 shadow-md rounded-2xl'
      >
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Welcome Back! Sign In
        </h2>

        <InputField
          label='Email'
          register={register("email")}
          error={errors.email}
        />
        <InputField
          label='Password'
          register={register("password")}
          error={errors.password}
          type='password'
        />

        {message && (
          <p
            className={`text-sm mt-2 text-center ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button loading={loading}>Sign In</Button>

        <p className='mt-8 text-center'>
          Don't have an account yet?{" "}
          <a className='text-blue-500' href='/register'>
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
