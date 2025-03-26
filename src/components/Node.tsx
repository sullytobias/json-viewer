import { useState } from "react";
import { JsonValue, useJson } from "../stores/useJsonStore";
import { getValueColor } from "../utils/detectType";
import { useToast } from "../context/ToastContext";

type NodeProps = {
  data: JsonValue;
  path: string;
  breadcrumbValue: string;
  depth: number;
};

export default function Node({
  data,
  path,
  breadcrumbValue,
  depth,
}: NodeProps) {
  const [open, setOpen] = useState(true);

  const { setSelectedPath, highlightedPath } = useJson();
  const toast = useToast();

  const isObject = typeof data === "object" && data !== null;

  const handleCopy = (text: string, type: "path" | "value") => {
    navigator.clipboard.writeText(text).then(() => {
      toast(`✅ ${type === "path" ? "Path" : "Value"} copied!`);
    });
  };

  const handleOpen = () => {
    setOpen(!open);
    setSelectedPath(breadcrumbValue);
  };

  if (!isObject) {
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
        <span className="text-gray-400 italic">{path}:</span>
        <span className={`${getValueColor(data)} font-mono`}>
          {JSON.stringify(data)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(breadcrumbValue, "path");
          }}
          className="text-xs relative cursor-pointer text-blue-400 opacity-0 group-hover:opacity-100 hover:underline"
          title="Copy Path"
        >
          [📎 Path]
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(JSON.stringify(data), "value");
          }}
          className="text-xs relative cursor-pointer text-teal-400 opacity-0 group-hover:opacity-100 hover:underline"
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
          {icon} {path}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
