import { JsonValue } from "../stores/useJsonStore";

export interface JsonStats {
  totalKeys: number;
  maxDepth: number;
  objectCount: number;
  arrayCount: number;
}

export function analyzeJson(data: JsonValue): JsonStats {
  let totalKeys = 0;
  let maxDepth = 0;
  let objectCount = 0;
  let arrayCount = 0;

  function traverse(node: JsonValue, depth: number) {
    if (depth > maxDepth) maxDepth = depth;

    if (Array.isArray(node)) {
      arrayCount++;
      for (const item of node) {
        traverse(item, depth + 1);
      }
    } else if (node && typeof node === "object") {
      objectCount++;
      for (const key in node) {
        totalKeys++;
        traverse(node[key], depth + 1);
      }
    }
  }

  traverse(data, 1);

  return {
    totalKeys,
    maxDepth,
    objectCount,
    arrayCount,
  };
}
