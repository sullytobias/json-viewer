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
      <div className="pl-4">
        <span className="text-gray-400">{path}: </span>
        <span className="text-green-400">{JSON.stringify(data)}</span>
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((val, i) => [i, val])
    : Object.entries(data);

  return (
    <div className="space-y-1" style={{ marginLeft: depth * 12 }}>
      <button
        onClick={() => setOpen(!open)}
        className="text-yellow-300 hover:underline"
      >
        {open ? '▾' : '▸'} {path} ({Array.isArray(data) ? 'Array' : 'Object'})
      </button>
      {open && (
        <div className="ml-4">
          {entries.map(([key, value]) => (
            <Node
              key={path + '.' + key}
              data={value}
              path={String(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
} 