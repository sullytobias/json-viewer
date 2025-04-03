import { JsonValue, JsonObject, useJson } from "../stores/useJsonStore";
import Node from "./Node";

interface TreeViewProps {
  searchQuery: string;
}

export default function TreeView({ searchQuery }: TreeViewProps) {
  const { json } = useJson();
  if (!json) return null;

  const filterJson = (data: JsonValue): JsonValue | null => {
    if (!searchQuery) return data;

    const lowerSearch = searchQuery.toLowerCase();

    if (typeof data === "string") {
      return data.toLowerCase().includes(lowerSearch) ? data : null;
    }

    if (
      typeof data === "number" ||
      typeof data === "boolean" ||
      data === null
    ) {
      return String(data).toLowerCase().includes(lowerSearch) ? data : null;
    }

    if (Array.isArray(data)) {
      const filtered = data
        .map(filterJson)
        .filter((item): item is JsonValue => item !== null);
      return filtered.length ? filtered : null;
    }

    if (typeof data === "object") {
      const result: JsonObject = {};
      for (const [key, value] of Object.entries(data)) {
        const keyMatch = key.toLowerCase().includes(lowerSearch);
        const filtered = filterJson(value);
        if (keyMatch || filtered !== null) {
          result[key] = filtered;
        }
      }
      return Object.keys(result).length ? result : null;
    }

    return null;
  };

  const filteredJson = filterJson(json);

  if (!filteredJson) {
    return (
      <p className="text-gray-400 text-center mt-6">❌ No matches found</p>
    );
  }

  return (
    <div className="mt-6 p-4 overflow-auto">
      <Node
        breadcrumbValue="root"
        data={filteredJson}
        path="root"
        depth={0}
        searchTerm={searchQuery}
      />
    </div>
  );
}
