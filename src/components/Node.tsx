import { useState } from 'react';
import { JsonValue } from '../stores/useJsonStore';
import { getValueColor } from '../utils/detectType';

type NodeProps = {
  data: JsonValue;
  path: string;
  depth: number;
};

const handleCopy = (text: string) => navigator.clipboard.writeText(text).catch(console.error);

export default function Node({ data, path, depth }: NodeProps) {
  const [open, setOpen] = useState(true);
  const isObject = typeof data === 'object' && data !== null;

  if (!isObject) {
    const value = JSON.stringify(data);
    const color = getValueColor(data);
  
    
    return (
      <div className="pl-6 py-1 flex items-center gap-2 group">
        <span className="text-gray-400 italic">{path}:</span>
        <span className={`${color} font-mono`}>{value}</span>
  
        <button
          onClick={() => handleCopy(path)}
          className="text-s text-blue-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:underline"
          title="Copy Path"
        >
          [📎 Path]
        </button>
  
        <button
          onClick={() => handleCopy(value)}
          className="text-s text-teal-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:underline"
          title="Copy Value"
        >
          [📋 Value]
        </button>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((val, i) => [i, val]) : Object.entries(data);
  const icon = isArray ? '📑' : '📁';
  const itemCount = entries.length;

  return (
    <div className="space-y-1" style={{ marginLeft: depth * 12 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 text-yellow-200 hover:text-yellow-100 focus:outline-none group"
      >
        <span
          className={`transform transition-transform duration-200 ${
            open ? 'rotate-90' : 'rotate-0'
          }`}
        >
          ▶
        </span>
        <span className="text-sm font-semibold group-hover:underline">
          {icon} {path}
        </span>
        <span className="text-xs text-white">
          ({isArray ? 'Array' : 'Object'}) [{itemCount}]
        </span>
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l-2 border-gray-700 space-y-1">
          {entries.map(([key, value]) => (
            <Node
              key={`${path}.${key}`}
              data={value as JsonValue}
              path={String(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}