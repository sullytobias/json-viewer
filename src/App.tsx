// jsonhero-clone/src/App.tsx
import { useState } from "react";
import TreeView from "./components/TreeView";
import { JsonValue, useJson } from "./stores/useJsonStore";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [input, setInput] = useState<string>("");
  const [showOnlyTree, setShowOnlyTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setJson } = useJson();

  const handleLoad = () => {
    setLoading(true);
    try {
      const parsed: JsonValue = JSON.parse(input);
      setTimeout(() => {
        setJson(parsed);
        setLoading(false);
      }, 500);
    } catch {
      alert("⛔ JSON invalide");
      setLoading(false);
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

  const error = input.length > 0 && !isValidJson ? "⛔ JSON invalide" : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center flex-1">JSON Viewer</h1>
        <button
          onClick={() => setShowOnlyTree((prev) => !prev)}
          className="ml-4 cursor-pointer text-sm bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded shadow"
        >
          {showOnlyTree ? "Back to Input" : "Focus TreeView"}
        </button>
      </div>

      <AnimatePresence>
        {!showOnlyTree && (
          <motion.div
            key="input-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "Toto", "age": 42}'
              className="w-full h-48 p-4 text-gray-100 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            />
            {error ? (
              <p className="text-red-400 mt-2">{error}</p>
            ) : (
              input.length > 0 && (
                <p className="text-green-400 mt-2">✅ Valid Format</p>
              )
            )}

            <button
              onClick={handleLoad}
              disabled={loading}
              className={`mt-4 px-6 py-2 rounded text-white font-semibold shadow-md ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="white"
                      strokeWidth="4"
                      opacity="0.75"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Load JSON"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <TreeView />
    </div>
  );
}
