import { useState } from "react";
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
  const { setSelectedPath, highlightedPath } = useJson();
  const toast = useToast();

  const isObject = typeof data === "object" && data !== null;

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-500 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleCopy = (text: string, type: "path" | "value") => {
    navigator.clipboard.writeText(text).then(() => {
      toast(`✅ ${type === "path" ? "Path" : "Value"} copied!`);
    });
  };

  const handleOpen = () => {
    setOpen(!open);
    setSelectedPath(breadcrumbValue);
  };

  const [expanded, setExpanded] = useState(false);
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
      const shortText = `${data.slice(0, MAX_LENGTH)}...`;

      if (isUrl) {
        displayValue = (
          <a
            href={data}
            target="_blank"
            rel="noopener noreferrer"
            className={`${valueClass} underline hover:text-blue-400 transition-colors`}
          >
            "{data}"
          </a>
        );
      } else {
        displayValue = (
          <>
            <span className={valueClass}>
              "{expanded || !isLong ? data : shortText}"
            </span>
            {isLong && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
                className="ml-2 cursor-pointer text-xs text-yellow-400 underline"
              >
                [{expanded ? "Show Less" : "Show More"}]
              </button>
            )}
          </>
        );
      }
    } else {
      displayValue = <span className={valueClass}>{data}</span>;
    }

    return (
      <div
        id={breadcrumbValue}
        className={`pl-6 py-1 flex items-center gap-2 group cursor-pointer transition-colors duration-300 ${
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
          title="Copy Path"
        >
          [📎 Path]
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(JSON.stringify(data), "value");
          }}
          className="text-xs text-teal-400 opacity-0 group-hover:opacity-100 hover:underline"
          title="Copy Value"
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
  const itemCount = entries.length;

  return (
    <div
      id={breadcrumbValue}
      className={`space-y-1 transition-colors duration-300 ${
        highlightedPath === breadcrumbValue
          ? "bg-yellow-500/10 border-l-4 border-yellow-400"
          : ""
      }`}
      style={{ marginLeft: depth * 12 }}
    >
      <button
        onClick={handleOpen}
        className="flex cursor-pointer items-center gap-2 text-yellow-200 hover:text-yellow-100 focus:outline-none group"
      >
        <span
          className={`transform transition-transform duration-200 ${
            open ? "rotate-90" : "rotate-0"
          }`}
        >
          ▶
        </span>
        <span className="text-sm font-semibold group-hover:underline">
          {icon} {highlightMatch(path)}
        </span>
        <span className="text-xs text-white">
          ({isArray ? "Array" : "Object"}) [{itemCount}]
        </span>
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l-2 border-gray-700 space-y-1">
          {entries.map(([key, value]) => (
            <Node
              key={`${breadcrumbValue}.${key}`}
              data={value as JsonValue}
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
