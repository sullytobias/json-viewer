import { useState } from "react";

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };

type DiffResult =
  | { type: "added"; path: string; value: JsonValue }
  | { type: "removed"; path: string; value: JsonValue }
  | { type: "changed"; path: string; oldValue: JsonValue; newValue: JsonValue };

function isObject(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function diffJsonRecursive(
  a: JsonValue,
  b: JsonValue,
  path: string = ""
): DiffResult[] {
  const diffs: DiffResult[] = [];

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      const valA = a[key];
      const valB = b[key];

      if (!(key in a)) {
        diffs.push({ type: "added", path: currentPath, value: valB });
      } else if (!(key in b)) {
        diffs.push({ type: "removed", path: currentPath, value: valA });
      } else {
        diffs.push(...diffJsonRecursive(valA, valB, currentPath));
      }
    });
  } else if (JSON.stringify(a) !== JSON.stringify(b)) {
    diffs.push({ type: "changed", path, oldValue: a, newValue: b });
  }

  return diffs;
}

export default function DiffViewer() {
  const [jsonA, setJsonA] = useState<string>("");
  const [jsonB, setJsonB] = useState<string>("");
  const [diff, setDiff] = useState<DiffResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    try {
      const a: JsonValue = JSON.parse(jsonA);
      const b: JsonValue = JSON.parse(jsonB);
      const result = diffJsonRecursive(a, b);
      setDiff(result);
      setError(null);
    } catch {
      setError("❌ Invalid JSON in one of the inputs");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Diff Two JSONs</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={jsonA}
          onChange={(e) => setJsonA(e.target.value)}
          placeholder="JSON A"
          className="w-full h-64 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded font-mono text-sm"
        />
        <textarea
          value={jsonB}
          onChange={(e) => setJsonB(e.target.value)}
          placeholder="JSON B"
          className="w-full h-64 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded font-mono text-sm"
        />
      </div>
      <button
        onClick={handleCompare}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
      >
        Compare
      </button>
      <div className="mt-6 space-y-2">
        {diff.map((item, index) => (
          <div key={index} className="text-sm font-mono">
            {item.type === "added" && (
              <div className="text-green-400">
                + {item.path}: {JSON.stringify(item.value)}
              </div>
            )}
            {item.type === "removed" && (
              <div className="text-red-400">
                - {item.path}: {JSON.stringify(item.value)}
              </div>
            )}
            {item.type === "changed" && (
              <div className="text-yellow-400">
                ~ {item.path}: {JSON.stringify(item.oldValue)} →{" "}
                {JSON.stringify(item.newValue)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
