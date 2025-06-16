import React, { useState } from 'react';

export default function Home() {
  const [instruction, setInstruction] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction }),
      });
      const data = await res.json();
      setResult(data.code || data.error);
    } catch (err) {
      setResult('Error generating code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AutoAPI</h1>
      <textarea
        className="border p-2 w-full"
        rows={4}
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Describe the API task"
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 overflow-auto">
{result}
        </pre>
      )}
    </div>
  );
}
