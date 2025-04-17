'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod validation schema
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

// Reusable input field
const InputField = ({
  label,
  register,
  error,
  type = "text",
}: {
  label: string;
  register: ReturnType<ReturnType<typeof useForm>["register"]>; // Updated type
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

// Submit button
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
    {loading ? 'Registering...' : children}
  </button>
);

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post('http://localhost:5000/register', data);
      setMessage('Registration successful! Redirecting...');
      console.log('✅ Registered:', res.data);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Registration failed. Try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white p-8 shadow-md rounded-2xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome! Register with Us
        </h2>

        <InputField
          label="Name"
          register={register("name")}
          error={errors.name}
        />
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

        <Button loading={loading}>Register</Button>

        <p className="mt-8 text-center">
          Already have an account?{' '}
          <a className="text-blue-500" href="/login">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
