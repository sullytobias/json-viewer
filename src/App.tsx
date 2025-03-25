import { useState } from 'react';
import TreeView from './components/TreeView';
import { JsonValue, useJson } from './stores/useJsonStore';


export default function App() {
  const [input, setInput] = useState<string>('');
  const { setJson } = useJson();

  const handleLoad = () => {
    try {
      const parsed: JsonValue = JSON.parse(input);
      setJson(parsed);
    } catch {
      alert('⛔ JSON invalide');
    }
  };

  const isValidJson = (() => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  })();

  const error = input.length > 0 && !isValidJson ? '⛔ JSON invalide' : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">JSON Viewer</h1>

      <div className="max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Toto", "age": 42}'
          className="w-full h-48 p-4 text-gray-100 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
        />
        {error ? (
          <p className="text-red-400 mt-2">{error}</p>
        ) : (
          input.length > 0 && <p className="text-green-400 mt-2">✅ Valid Format</p>
        )}

        <button
          onClick={handleLoad}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold shadow-md"
        >
          Load JSON
        </button>
      </div>

      <TreeView />
    </div>
  );
}
