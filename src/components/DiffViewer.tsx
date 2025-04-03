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
  path = ""
): DiffResult[] {
  const diffs: DiffResult[] = [];

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
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
    }
  } else if (JSON.stringify(a) !== JSON.stringify(b)) {
    diffs.push({ type: "changed", path, oldValue: a, newValue: b });
  }

  return diffs;
}

export default function DiffViewer() {
  const [jsonA, setJsonA] = useState("");
  const [jsonB, setJsonB] = useState("");
  const [diff, setDiff] = useState<DiffResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    try {
      const a: JsonValue = JSON.parse(jsonA);
      const b: JsonValue = JSON.parse(jsonB);
      setDiff(diffJsonRecursive(a, b));
      setError(null);
    } catch {
      setError("❌ Invalid JSON in one of the inputs");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-center">Diff Two JSONs</h1>
      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[jsonA, jsonB].map((_, i) => (
          <textarea
            key={i}
            value={i === 0 ? jsonA : jsonB}
            onChange={(e) =>
              i === 0 ? setJsonA(e.target.value) : setJsonB(e.target.value)
            }
            placeholder={`JSON ${i === 0 ? "A" : "B"}`}
            className="h-64 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded text-sm font-mono w-full resize-none focus:outline-none focus:border-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleCompare}
        className="block mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow text-sm font-semibold"
      >
        Compare
      </button>

      <div className="mt-4 space-y-1 text-sm font-mono">
        {diff.map((item, index) => (
          <div
            key={index}
            className={
              item.type === "added"
                ? "text-green-500"
                : item.type === "removed"
                  ? "text-red-500"
                  : "text-yellow-500"
            }
          >
            {item.type === "added" &&
              `+ ${item.path}: ${JSON.stringify(item.value)}`}
            {item.type === "removed" &&
              `- ${item.path}: ${JSON.stringify(item.value)}`}
            {item.type === "changed" &&
              `~ ${item.path}: ${JSON.stringify(item.oldValue)} → ${JSON.stringify(item.newValue)}`}
          </div>
        ))}
      </div>
    </div>
  );
}
