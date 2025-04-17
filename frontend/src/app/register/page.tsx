"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { UseFormRegisterReturn } from "react-hook-form";

const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
});

type SignUpData = z.infer<typeof SignUpSchema>;

const InputField = ({
  label,
  register,
  error,
  type = "text",
}: {
  label: string;
  register: UseFormRegisterReturn;
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
    {loading ? "Signing up..." : children}
  </button>
);

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({ resolver: zodResolver(SignUpSchema) });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignUpData) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(
        // "http://localhost:5000/signup",
        "https://cc-1021100307.onrender.com/signup",
        data
      );
      console.log("Registered:", response.data);
      router.push("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-md m-auto mt-24 p-8 border-white border-2 shadow-md rounded-2xl'
      >
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Welcome! Register with Us
        </h2>

        <InputField
          label='Name'
          register={register("name")}
          error={errors.name}
        />
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

        {errorMessage && (
          <p className='text-red-600 text-sm text-center mb-4'>
            {errorMessage}
          </p>
        )}

        <Button loading={loading}>Sign Up</Button>

        <p className='mt-8 text-center'>
          Already have an account?{" "}
          <a className='text-blue-500' href='/login'>
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
