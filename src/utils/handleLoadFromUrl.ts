import { JsonValue } from "../stores/useJsonStore";

export const handleLoadFromUrl = async (
  urlInput: string,
  setLoading: (loading: boolean) => void,
  setJson: (json: JsonValue) => void,
  setInput: (input: string) => void
): Promise<void> => {
  if (!urlInput) {
    alert("Please enter a URL.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(urlInput);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("URL does not return JSON content");
    }

    const json = await response.json();
    setJson(json);
    setInput(JSON.stringify(json, null, 2));
  } catch (error: unknown) {
    let message = "Unknown error occurred";

    if (error instanceof Error) message = error.message;

    console.error("Fetch error:", error);
    alert(`❌ Failed to load JSON: ${message}`);
  } finally {
    setLoading(false);
  }
};
