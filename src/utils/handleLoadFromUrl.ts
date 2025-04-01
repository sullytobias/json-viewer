export const handleLoadFromUrl = async (
  urlInput,
  setLoading,
  setJson,
  setInput
) => {
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
  } catch (error: any) {
    console.error("Fetch error:", error);
    alert(`❌ Failed to load JSON: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
