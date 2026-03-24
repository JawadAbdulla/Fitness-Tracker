import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  let store;
  try {
    store = getStore({ name: "tracker", consistency: "strong" });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: "Store init failed: " + e.message }),
      { status: 500, headers }
    );
  }

  if (req.method === "GET") {
    try {
      const raw = await store.get("state");
      if (!raw) {
        return new Response(JSON.stringify({ ok: true, data: null }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ ok: true, data: JSON.parse(raw) }), { status: 200, headers });
    } catch (e) {
      return new Response(
        JSON.stringify({ ok: false, error: "GET failed: " + e.message }),
        { status: 500, headers }
      );
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.text();
      JSON.parse(body); // validate it's real JSON before saving
      await store.set("state", body);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (e) {
      return new Response(
        JSON.stringify({ ok: false, error: "POST failed: " + e.message }),
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ ok: false, error: "Method not allowed" }),
    { status: 405, headers }
  );
};

export const config = {
  path: "/api/data",
};
