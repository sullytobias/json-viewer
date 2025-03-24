import { useState } from 'react';
import { JsonValue } from '../stores/useJsonStore';

type NodeProps = {
  data: JsonValue;
  path: string;
  depth: number;
};

export default function Node({ data, path, depth }: NodeProps) {
  const [open, setOpen] = useState(true);
  const isObject = typeof data === 'object' && data !== null;

  if (!isObject) {
    return (
      <div className="pl-6 py-1">
        <span className="text-gray-400 italic">{path}:</span>{' '}
        <span className="text-green-400">{JSON.stringify(data)}</span>
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((val, i) => [i, val])
    : Object.entries(data);

  const icon = Array.isArray(data) ? '📑' : '📁';

  return (
    <div className="space-y-1" style={{ marginLeft: depth * 12 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-yellow-200 hover:text-yellow-100 focus:outline-none group"
      >
        <span
          className={`transform transition-transform duration-200 ${
            open ? 'rotate-90' : 'rotate-0'
          }`}
        >
          ▶
        </span>
        <span className="text-sm font-semibold group-hover:underline">{icon} {path}</span>
        <span className="text-xs text-gray-500">
          ({Array.isArray(data) ? 'Array' : 'Object'}) {Array.isArray(data) ? `[${entries.length}]` : ''}
        </span>
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l-2 border-gray-700 space-y-1">
          {entries.map(([key, value]) => (
            <Node
              key={path + '.' + key}
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