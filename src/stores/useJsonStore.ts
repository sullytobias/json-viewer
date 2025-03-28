import { Store } from "@tanstack/store";
import { useSyncExternalStore } from "react";

export interface JsonObject {
  [key: string]: JsonValue;
}

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
}

const jsonStore = new Store<JsonStoreState>({
  json: null,
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

  const setJson = (newJson: JsonValue) => {
    jsonStore.setState((prev) => ({
      ...prev,
      json: newJson,
    }));
  };

  const setSelectedPath = (path: string) => {
    jsonStore.setState((prev) => ({
      ...prev,
      selectedPath: path,
    }));
  };

  const highlightedPath = useSyncExternalStore(
    jsonStore.subscribe,
    () => jsonStore.state.highlightedPath
  );

  const setHighlightedPath = (path: string) => {
    jsonStore.setState((prev) => ({ ...prev, highlightedPath: path }));
  };

  return {
    json,
    setJson,
    selectedPath,
    setSelectedPath,
    highlightedPath,
    setHighlightedPath,
  };
};
