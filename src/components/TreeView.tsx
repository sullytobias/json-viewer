import { JsonValue, JsonObject, useJson } from "../stores/useJsonStore";
import Node from "./Node";

interface TreeViewProps {
  searchQuery: string;
}

export default function TreeView({ searchQuery }: TreeViewProps) {
  const { json } = useJson();
  if (!json) return null;

  const filterJson = (data: JsonValue): JsonValue => {
    if (!searchQuery) return data;

    if (typeof data === "string") {
      return data.toLowerCase().includes(searchQuery.toLowerCase())
        ? data
        : null;
    }

    if (Array.isArray(data)) {
      const filteredArray = data
        .map((item) => filterJson(item))
        .filter((item) => item !== null);
      return filteredArray.length > 0 ? filteredArray : null;
    }

    if (typeof data === "object" && data !== null) {
      const filteredObject: JsonObject = {};
      Object.entries(data).forEach(([key, value]) => {
        const keyMatches = key
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const filteredValue = filterJson(value);
        if (keyMatches || filteredValue !== null) {
          filteredObject[key] = filteredValue;
        }
      });
      return Object.keys(filteredObject).length > 0 ? filteredObject : null;
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
    <div className="mt-6 p-4 rounded overflow-auto h-screen">
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
