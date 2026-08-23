export default async function handler(req, res) {
  // Trả về OK khi kiểm tra bằng trình duyệt (tránh lỗi 405)
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "Webhook is active" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      return res.status(500).json({
        ok: false,
        error: "GOOGLE_APPS_SCRIPT_URL is missing in Vercel Environment Variables"
      });
    }

    // Chuyển tiếp toàn bộ dữ liệu sang Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bridge_secret: process.env.BRIDGE_SECRET || "",
        zalo_data: req.body
      })
    });

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
      error: error.message || "Failed to forward request"
    });
  }
}
