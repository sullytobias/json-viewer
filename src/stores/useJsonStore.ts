import { Store } from '@tanstack/store';
import { useSyncExternalStore } from 'react';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonStoreState = {
  json: JsonValue | null;
};

const jsonStore = new Store<JsonStoreState>({
  json: null,
});

export const useJson = () => {
  const json = useSyncExternalStore(
    jsonStore.subscribe,
    () => jsonStore.state.json
  );

  const setJson = (newJson: JsonValue) => {
    jsonStore.setState((prev) => ({
      ...prev,
      json: newJson,
    }));
  };

  return { json, setJson };
};