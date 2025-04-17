'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

type Contact = {
  contact_id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
};

export default function EditContactPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<Contact>({
    contact_id: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get<Contact>(`https://cc-1021100307.onrender.com/${id}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to load contact.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContact();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`https://cc-1021100307.onrender.com/${id}`, form);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to update contact.');
    }
  };

  if (loading) return <p className="text-red-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 text-red-700 dark:text-red-400 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="email"
          name="companyEmail"
          placeholder="Company Email"
          value={form.companyEmail}
          onChange={handleChange}
          className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="tel"
          name="companyPhone"
          placeholder="Company Phone"
          value={form.companyPhone}
          onChange={handleChange}
          className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          name="companyAddress"
          placeholder="Company Address"
          value={form.companyAddress}
          onChange={handleChange}
          className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Update Contact
        </button>
      </form>
    </div>
  );
}
