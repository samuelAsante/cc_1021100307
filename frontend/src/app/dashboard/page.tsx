"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";

type Contact = {
  contact_id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
};

export default function DashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>(
          // "http://localhost:5000/contacts"
          "https://cc-1021100307.onrender.com/contacts"
        );
        setContacts(response.data);
      } catch (err: any) {
        setError("Failed to load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(
          // `http://localhost:5000/contacts/${id}`
          `https://cc-1021100307.onrender.com/contacts/${id}`
        );
        // await axios.delete();
        setContacts(contacts.filter((contact) => contact.contact_id !== id));
      } catch (err) {
        alert("Failed to delete contact.");
      }
    }
  };

  return (
    <div className='space-y-6 text-black p-4 rounded-xl shadow'>
      {/* Header */}
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <h2 className='text-2xl font-bold'>All Contacts</h2>
        <Link
          href='/dashboard/contacts/add'
          className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition'
        >
          <Plus size={16} /> Add Contact
        </Link>
      </div>

      {/* Contact Table */}
      {loading ? (
        <p className=''>Loading contacts...</p>
      ) : error ? (
        <p className=''>{error}</p>
      ) : contacts.length === 0 ? (
        <p className=''>No contacts found.</p>
      ) : (
        <div className='overflow-x-auto rounded-lg border border-red-200 dark:border-red-700'>
          <table className='min-w-full divide-y divide-red-200 dark:divide-red-700'>
            <thead className=''>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                  Phone
                </th>
                <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                  Address
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-red-100 dark:divide-red-800'>
              {contacts.map((contact) => (
                <tr
                  key={contact.contact_id}
                  className='hover:bg-red-50 dark:hover:bg-zinc-50 transition'
                >
                  <td className='px-6 py-4 text-sm font-medium'>
                    {contact.companyName}
                  </td>
                  <td className='px-6 py-4 text-sm'>{contact.companyEmail}</td>
                  <td className='px-6 py-4 text-sm'>{contact.companyPhone}</td>
                  <td className='px-6 py-4 text-sm'>
                    {contact.companyAddress}
                  </td>
                  <td className='px-6 py-4 text-sm flex gap-2'>
                    <Link
                      href={`/dashboard/contacts/edit/${contact.contact_id}`}
                      className='inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg dark:bg-white text-red-700 hover:bg-red-200'
                    >
                      <Pencil size={14} className='mr-1' />
                    </Link>
                    <button
                      onClick={() => handleDelete(contact.contact_id)}
                      className='inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg dark:bg-white text-red-700 hover:bg-red-200'
                    >
                      <Trash2 size={14} className='mr-1' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
