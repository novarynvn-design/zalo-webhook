export default async function handler(req, res) {
  // Chỉ nhận POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method Not Allowed"
    });
  }

  // Secret từ Zalo
  const zaloSecret = req.headers["x-bot-api-secret-token"];

  if (zaloSecret !== process.env.ZALO_SECRET_TOKEN) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized"
    });
  }

  try {
    const response = await fetch(
      process.env.GOOGLE_APPS_SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bridge-Secret": process.env.BRIDGE_SECRET
        },
        body: JSON.stringify(req.body)
      }
    );

    const result = await response.text();

    return res.status(200).json({
      ok: true,
      forwarded: true,
      appsScriptStatus: response.status,
      result
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Failed to forward request"
    });
  }
}
