import { useState } from 'react';
import TreeView from './components /TreeView';
import { useJsonStore } from './stores/useJsonStore';

export default function App() {
  const [input, setInput] = useState('');
  const { setJson } = useJsonStore();

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(input);
      setJson(parsed);
    } catch {
      alert('⛔ JSON invalide');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-4">
      <h1 className="text-3xl font-bold">🧩 JSON Visualizer</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"name": "Toto", "age": 42}'
        className="w-full h-40 p-4 bg-gray-800 rounded text-sm font-mono"
      />
      <button
        onClick={handleLoad}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Charger le JSON
      </button>
      <TreeView />
    </div>
  );
}