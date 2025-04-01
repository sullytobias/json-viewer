import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TreeView from "./components/TreeView";
import Breadcrumb from "./components/Breadcrumb";
import { JsonValue, useJson } from "./stores/useJsonStore";
import { useTheme } from "./hooks/useTheme";
import { handleLoadFromUrl } from "./utils/handleLoadFromUrl";
import { analyzeJson } from "./utils/analyseJson";

export default function App() {
  const [input, setInput] = useState<string>("");
  const [showOnlyTree, setShowOnlyTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");

  const { theme, toggleTheme } = useTheme();
  const { setJson, json } = useJson();

  const stats = json ? analyzeJson(json) : null;

  useEffect(() => {
    const saved = localStorage.getItem("json");
    if (saved) setInput(saved);
  }, []);

  const handleLoad = () => {
    setLoading(true);
    try {
      const parsed: JsonValue = JSON.parse(input);
      setTimeout(() => {
        setJson(parsed);
        setLoading(false);
      }, 500);
    } catch {
      alert("Invalid JSON");
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

  const error = input.length > 0 && !isValidJson ? "Invalid JSON" : null;

  return (
    <div className="h-screen flex flex-col bg-white text-black dark:bg-gray-950 dark:text-white duration-500 overflow-hidden">
      <header className="sticky top-0 z-10 px-6 pt-6 pb-2 border-b border-gray-300 dark:border-gray-800 shadow-md bg-white dark:bg-gray-950">
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
          <h1 className="text-4xl font-bold text-center flex-1">JSON Viewer</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="text-sm bg-gray-800 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded shadow flex items-center gap-2"
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "dark" ? 0 : 360 }}
                transition={{ duration: 0.6 }}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </motion.span>
            </motion.button>
            <button
              onClick={() => setShowOnlyTree((prev) => !prev)}
              className="text-sm cursor-pointer w-30 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded shadow"
            >
              {showOnlyTree ? "Input" : "Focus"}
            </button>
          </div>
        </div>
        <Breadcrumb />
      </header>

      <motion.div layout transition={{ duration: 0.3 }} className="px-6 mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search JSON..."
          className="w-full p-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </motion.div>

      <div className="max-w-4xl mx-auto mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/data.json"
            className="w-full p-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() =>
              handleLoadFromUrl(urlInput, setLoading, setJson, setInput)
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            Load from URL
          </button>
        </div>
      </div>

      <motion.main layout className="flex-1 overflow-hidden flex flex-col">
        {!showOnlyTree && (
          <motion.section
            key="input-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4 px-6 space-y-6 max-h-[30vh] min-h-[30vh] border-b border-gray-300 dark:border-gray-800"
          >
            <div className="max-w-4xl mx-auto">
              {error ? (
                <p className="text-red-500 mb-2">{error}</p>
              ) : (
                input.length > 0 && (
                  <p className="text-green-500 mb-2">Valid Format</p>
                )
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "Toto", "age": 42}'
                className="w-full h-28 p-4 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleLoad}
                disabled={loading}
                className={`mt-4 px-6 py-2 rounded font-semibold shadow-md transition-colors text-white ${
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

        {stats && (
          <div className="max-w-4xl mx-auto text-sm text-gray-600 dark:text-gray-400 mt-4 space-x-4">
            <span>
              🧮 Total Keys: <strong>{stats.totalKeys}</strong>
            </span>
            <span>
              📐 Max Depth: <strong>{stats.maxDepth}</strong>
            </span>
            <span>
              📦 Objects: <strong>{stats.objectCount}</strong>
            </span>
            <span>
              📚 Arrays: <strong>{stats.arrayCount}</strong>
            </span>
          </div>
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
