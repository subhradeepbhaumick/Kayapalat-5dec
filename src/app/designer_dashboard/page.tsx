'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DesignerDashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data.clients);
    }
    fetchClients();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold my-6">Designer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clients.map((client: any) => (
          <Link
            href={`/designer/client/${client.id}`}
            key={client.id}
            className="border p-4 rounded-lg shadow hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p className="text-gray-500">{client.email}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
