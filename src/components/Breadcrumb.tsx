import { useJson } from "../stores/useJsonStore";

export default function Breadcrumb() {
  const { selectedPath, setSelectedPath, setHighlightedPath } = useJson();

  if (!selectedPath) return null;

  const parts = selectedPath.split(".");

  const handleClick = (index: number) => {
    const newPath = parts.slice(0, index + 1).join(".");
    setSelectedPath(newPath);
    setHighlightedPath(newPath);

    const el = document.getElementById(newPath);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => setHighlightedPath(""), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto mb-4 px-2 py-2 rounded bg-gray-900 border border-gray-800 shadow-sm text-sm font-mono text-gray-300 overflow-x-auto whitespace-nowrap">
      {parts.map((part, i) => {
        return (
          <span key={i} className="inline">
            {i > 0 && <span className="text-gray-600 mx-1">/</span>}
            <button
              onClick={() => handleClick(i)}
              className={`transition cursor-pointer hover:underline hover:text-blue-400 ${
                i === parts.length - 1
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300"
              }`}
            >
              {part}
            </button>
          </span>
        );
      })}
    </div>
  );
}
