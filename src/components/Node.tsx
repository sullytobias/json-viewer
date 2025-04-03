import { useEffect, useState } from "react";
import { JsonValue, useJson } from "../stores/useJsonStore";
import { getValueColor } from "../utils/detectType";
import { useToast } from "../context/ToastContext";

type NodeProps = {
  data: JsonValue;
  path: string;
  breadcrumbValue: string;
  depth: number;
  searchTerm?: string;
};

export default function Node({
  data,
  path,
  breadcrumbValue,
  depth,
  searchTerm = "",
}: NodeProps) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const {
    setSelectedPath,
    togglePinnedPath,
    highlightedPath,
    expandAll,
    collapseAll,
  } = useJson();

  const toast = useToast();
  const isObject = typeof data === "object" && data !== null;

  useEffect(() => {
    if (expandAll) setOpen(true);
    if (collapseAll) setOpen(false);
  }, [expandAll, collapseAll]);

  const handleCopy = (text: string, type: "path" | "value") => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast(`✅ ${type === "path" ? "Path" : "Value"} copied!`));
  };

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    return text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-500 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const MAX_LENGTH = 80;

  if (!isObject) {
    const valueClass = getValueColor(data);
    let displayValue: React.ReactNode;

    if (data === null) {
      displayValue = <span className={`${valueClass} italic`}>null</span>;
    } else if (typeof data === "boolean") {
      displayValue = (
        <span className={valueClass}>{String(data).toUpperCase()}</span>
      );
    } else if (typeof data === "string") {
      const isUrl = /^https?:\/\/[^\s]+$/.test(data);
      const isLong = data.length > MAX_LENGTH;
      const shortText = data.slice(0, MAX_LENGTH) + "...";

      displayValue = isUrl ? (
        <a
          href={data}
          target="_blank"
          rel="noopener noreferrer"
          className={`${valueClass} underline hover:text-blue-400 transition-colors`}
        >
          "{data}"
        </a>
      ) : (
        <>
          <span className={valueClass}>
            "{expanded || !isLong ? data : shortText}"
          </span>
          {isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="ml-2 text-xs text-yellow-400 underline"
            >
              [{expanded ? "Show Less" : "Show More"}]
            </button>
          )}
        </>
      );
    } else {
      displayValue = <span className={valueClass}>{data}</span>;
    }

    return (
      <div
        id={breadcrumbValue}
        className={`pl-6 py-1 flex items-center gap-2 group cursor-pointer ${
          highlightedPath === breadcrumbValue
            ? "bg-yellow-500/10 border-l-4 border-yellow-400"
            : ""
        }`}
        onClick={() => setSelectedPath(breadcrumbValue)}
      >
        <span className="text-gray-400 italic">{highlightMatch(path)}:</span>
        <span className="font-mono">{displayValue}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(breadcrumbValue, "path");
          }}
          className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 hover:underline"
        >
          [📎 Path]
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(JSON.stringify(data), "value");
          }}
          className="text-xs text-teal-400 opacity-0 group-hover:opacity-100 hover:underline"
        >
          [📋 Value]
        </button>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray
    ? data.map((val, i) => [i, val])
    : Object.entries(data);

  const icon = isArray ? "📑" : "📁";

  return (
    <div
      id={breadcrumbValue}
      className={`space-y-1 ${
        highlightedPath === breadcrumbValue
          ? "bg-yellow-500/10 border-l-4 border-yellow-400"
          : ""
      }`}
      style={{ marginLeft: depth * 12 }}
    >
      <button
        onClick={() => {
          setOpen(!open);
          setSelectedPath(breadcrumbValue);
        }}
        className="flex items-center gap-2 text-black dark:text-yellow-200 hover:text-yellow-100 focus:outline-none group"
      >
        <span
          className={`transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        >
          ▶
        </span>
        <span className="text-sm font-semibold group-hover:underline">
          {icon} {highlightMatch(path)}
        </span>
        <span className="text-xs text-white">
          ({isArray ? "Array" : "Object"}) [{entries.length}]
        </span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePinnedPath(breadcrumbValue);
        }}
        className="text-xs text-yellow-400 hover:underline"
        title="Pin Node"
      >
        [📌]
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l-2 border-gray-700 space-y-1">
          {entries.map(([key, val]) => (
            <Node
              key={`${breadcrumbValue}.${key}`}
              data={val}
              path={String(key)}
              breadcrumbValue={`${breadcrumbValue}.${key}`}
              depth={depth + 1}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
