import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  const store = getStore("site-data");
  const STATE_KEY = "tracker-state";

  // SAVE DATA (POST)
  if (event.httpMethod === "POST") {
    try {
      const currentState = JSON.parse(event.body);
      await store.setJSON(STATE_KEY, currentState);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Saved!" }),
      };
    } catch (error) {
      return { statusCode: 500, body: error.toString() };
    }
  }

  // LOAD DATA (GET)
  try {
    const data = await store.getJSON(STATE_KEY);
    // If no data exists yet, return an empty object
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};