import { JsonValue } from "../stores/useJsonStore";

export const getValueColor = (value: JsonValue): string => {
    if (value === null) return 'text-pink-400';
    switch (typeof value) {
      case 'string':
        return 'text-emerald-400';
      case 'number':
        return 'text-orange-400';
      case 'boolean':
        return 'text-purple-400';
      default:
        return 'text-white';
    }
  };