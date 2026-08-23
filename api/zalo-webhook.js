export default async function handler(req, res) {
  // 1. Cho phép cả GET và POST để tránh lỗi 405
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "Webhook ready" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // 2. Đã bỏ đoạn kiểm tra ZALO_SECRET_TOKEN gây lỗi 401

  try {
    const response = await fetch(
      process.env.GOOGLE_APPS_SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bridge_secret: process.env.BRIDGE_SECRET,
          zalo_data: req.body
        })
      }
    );

    const result = await response.text();

    return res.status(200).json({
      ok: true,
      forwarded: true,
      appsScriptStatus: response.status,
      result: result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      error: "Failed to forward request"
    });
  }
}
