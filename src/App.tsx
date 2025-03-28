import { useState } from "react";
import { motion } from "framer-motion";

import TreeView from "./components/TreeView";
import Breadcrumb from "./components/Breadcrumb";

import { JsonValue, useJson } from "./stores/useJsonStore";

export default function App() {
  const [input, setInput] = useState<string>("");
  const [showOnlyTree, setShowOnlyTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      alert("JSON invalide");
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

  const error = input.length > 0 && !isValidJson ? "JSON invalide" : null;

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <header className="sticky top-0 z-10 bg-gray-950 px-6 pt-6 pb-2 border-b border-gray-800 shadow-md">
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
          <h1 className="text-4xl font-bold text-center flex-1">JSON Viewer</h1>
          <button
            onClick={() => setShowOnlyTree((prev) => !prev)}
            className="ml-4 cursor-pointer text-sm bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded shadow w-50"
          >
            {showOnlyTree ? "Back to Input" : "Focus TreeView"}
          </button>
        </div>
        <Breadcrumb />
      </header>

      <motion.div layout transition={{ duration: 0.3 }} className="px-6 mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search JSON..."
          className="w-full p-2 text-gray-900 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-inner"
        />
      </motion.div>

      <motion.main
        layout
        className="flex-1 overflow-hidden flex flex-col bg-gray-950"
      >
        {!showOnlyTree && (
          <motion.section
            key="input-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4 px-6 space-y-6 max-h-[30vh] min-h-[30vh] bg-gray-950 border-b border-gray-800"
          >
            <div className="max-w-4xl mx-auto">
              {error ? (
                <p className="text-red-400 mb-2">{error}</p>
              ) : (
                input.length > 0 && (
                  <p className="text-green-400 mb-2">Valid Format</p>
                )
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "Toto", "age": 42}'
                className="w-full h-28 p-4 text-gray-100 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />

              <button
                onClick={handleLoad}
                disabled={loading}
                className={`mt-4 px-6 cursor-pointer py-2 rounded text-white font-semibold shadow-md transition-colors duration-300 ${
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
            </div>
          </motion.section>
        )}

        <motion.section
          layout
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-auto px-6 pb-6"
        >
          <TreeView searchQuery={searchQuery} />
        </motion.section>
      </motion.main>
    </div>
  );
}
