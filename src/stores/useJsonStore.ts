// stores/useJsonStore.ts
import { Store } from "@tanstack/store";
import { useSyncExternalStore } from "react";

export type JsonObject = { [key: string]: JsonValue };

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | JsonObject;

interface JsonStoreState {
  json: JsonValue | null;
  selectedPath: string;
  highlightedPath: string;
  pinnedPaths: string[];
  expandAll: boolean;
  collapseAll: boolean;
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
  pinnedPaths: [],
  expandAll: false,
  collapseAll: false,
});

export const useJson = () => {
  const subscribe = jsonStore.subscribe;

  const json = useSyncExternalStore(subscribe, () => jsonStore.state.json);
  const selectedPath = useSyncExternalStore(
    subscribe,
    () => jsonStore.state.selectedPath
  );
  const highlightedPath = useSyncExternalStore(
    subscribe,
    () => jsonStore.state.highlightedPath
  );
  const pinnedPaths = useSyncExternalStore(
    subscribe,
    () => jsonStore.state.pinnedPaths
  );
  const expandAll = useSyncExternalStore(
    subscribe,
    () => jsonStore.state.expandAll
  );
  const collapseAll = useSyncExternalStore(
    subscribe,
    () => jsonStore.state.collapseAll
  );

  return {
    json,
    selectedPath,
    highlightedPath,
    pinnedPaths,
    expandAll,
    collapseAll,

    setJson: (json: JsonValue) => {
      localStorage.setItem("json", JSON.stringify(json));
      jsonStore.setState((prev) => ({ ...prev, json }));
    },

    setSelectedPath: (path: string) =>
      jsonStore.setState((prev) => ({ ...prev, selectedPath: path })),

    setHighlightedPath: (path: string) =>
      jsonStore.setState((prev) => ({ ...prev, highlightedPath: path })),

    togglePinnedPath: (path: string) =>
      jsonStore.setState((prev) => {
        const pinned = prev.pinnedPaths.includes(path)
          ? prev.pinnedPaths.filter((p) => p !== path)
          : [...prev.pinnedPaths, path];
        return { ...prev, pinnedPaths: pinned };
      }),

    triggerExpandAll: () =>
      jsonStore.setState((prev) => ({
        ...prev,
        expandAll: true,
        collapseAll: false,
      })),

    triggerCollapseAll: () =>
      jsonStore.setState((prev) => ({
        ...prev,
        collapseAll: true,
        expandAll: false,
      })),
  };
};
