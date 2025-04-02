import { useState } from "react";
import { useJson } from "../stores/useJsonStore";
import { motion, AnimatePresence } from "framer-motion";

export default function PinnedSidebar() {
  const { pinnedPaths, setSelectedPath, setHighlightedPath } = useJson();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleClick = (path: string) => {
    const el = document.getElementById(path);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectedPath(path);
      setHighlightedPath(path);
      setTimeout(() => setHighlightedPath(""), 1000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 right-0 -translate-y-1/2 bg-gray-800 text-white w-64 p-4 shadow-lg rounded-l z-20"
          >
            <h3 className="text-lg font-semibold mb-2">📌 Pinned</h3>
            <ul className="space-y-2 text-sm">
              {pinnedPaths.length === 0 && (
                <li className="italic text-gray-400">No pinned nodes</li>
              )}
              {pinnedPaths.map((path) => (
                <li key={path}>
                  <button
                    onClick={() => handleClick(path)}
                    className="hover:underline text-yellow-300"
                  >
                    {path}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute default cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-yellow-500 text-black px-2 py-1 rounded-l shadow"
            >
              ⏴
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed cursor-pointer top-1/2 right-0 -translate-y-1/2 bg-yellow-500 text-black px-2 py-1 rounded-l shadow z-10"
        >
          📌
        </button>
      )}
    </>
  );
}
