'use client';

import { useEffect, useState } from 'react';

export default function ClientDetails({ params }: any) {
  const { id } = params;
  const [client, setClient] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    async function fetchClient() {
      const res = await fetch(`/api/clients/${id}`);
      const data = await res.json();
      setClient(data.client);
    }
    fetchClient();
  }, [id]);

  async function handlePost() {
    const formData = new FormData();
    formData.append("clientId", id);
    formData.append("file", file!);
    formData.append("description", desc);

    await fetch("/api/post-design", {
      method: "POST",
      body: formData,
    });

    alert("Design posted!");
  }

  if (!client) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {client.name}'s Requirements
      </h1>

      <p className="mb-6">{client.requirements}</p>

      <div className="border p-4 rounded-lg shadow-lg">
        <h2 className="font-semibold mb-2">Post Your Design</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files![0])}
          className="mb-4"
        />

        <textarea
          className="border w-full p-2 mb-4"
          placeholder="Design description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button
          onClick={handlePost}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
