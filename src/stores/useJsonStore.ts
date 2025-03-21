import { create } from 'zustand';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonStore {
  json: JsonValue | null;
  setJson: (json: JsonValue) => void;
}

export const useJsonStore = create<JsonStore>((set) => ({
  json: null,
  setJson: (json) => set({ json }),
}));
