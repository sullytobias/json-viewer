// stores/useJsonStore.ts
import { Store } from "@tanstack/store";
import { useSyncExternalStore } from "react";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonStoreState {
  json: JsonValue | null;
  selectedPath: string;
  highlightedPath: string;
}

const initialJson = (() => {
  const raw = localStorage.getItem("json");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const jsonStore = new Store<JsonStoreState>({
  json: initialJson,
  selectedPath: "",
  highlightedPath: "",
});

export const useJson = () => {
  const json = useSyncExternalStore(
    jsonStore.subscribe,
    () => jsonStore.state.json
  );
  const selectedPath = useSyncExternalStore(
    jsonStore.subscribe,
    () => jsonStore.state.selectedPath
  );
  const highlightedPath = useSyncExternalStore(
    jsonStore.subscribe,
    () => jsonStore.state.highlightedPath
  );

  const setJson = (json: JsonValue) => {
    localStorage.setItem("json", JSON.stringify(json));
    jsonStore.setState((prev) => ({ ...prev, json }));
  };

  const setSelectedPath = (path: string) => {
    jsonStore.setState((prev) => ({ ...prev, selectedPath: path }));
  };

  const setHighlightedPath = (path: string) => {
    jsonStore.setState((prev) => ({ ...prev, highlightedPath: path }));
  };

  return {
    json,
    selectedPath,
    highlightedPath,
    setJson,
    setSelectedPath,
    setHighlightedPath,
  };
};
