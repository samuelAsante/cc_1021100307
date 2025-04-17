'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddContactSchema = z.object({
  companyName: z.string().min(2, 'Name is required'),
  companyEmail: z.string().email('Enter a valid email'),
  companyPhone: z.string().min(7, 'Phone number must be at least 7 digits'),
  companyAddress: z.string(),
});

type AddContactData = z.infer<typeof AddContactSchema>;

export default function AddContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddContactData>({
    resolver: zodResolver(AddContactSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: AddContactData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await axios.post('https://cc-1021100307.onrender.com', data);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Contact</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('companyName')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('companyEmail')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.companyEmail && <p className="text-sm text-red-600 mt-1">{errors.companyEmail.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            {...register('companyPhone')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.companyPhone && <p className="text-sm text-red-600 mt-1">{errors.companyPhone.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            {...register('companyAddress')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.companyAddress && <p className="text-sm text-red-600 mt-1">{errors.companyAddress.message}</p>}
        </div>

        {errorMsg && <p className="text-center text-red-600 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
}
