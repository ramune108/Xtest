export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Vercelに登録した APIキー
    const apiKey = process.env.RAPIDAPI_KEY;

    // 提供された curl コマンドに基づいた設定
    const response = await fetch("https://all-media-downloader1.p.rapidapi.com/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "all-media-downloader1.p.rapidapi.com"
      },
      // URLSearchParams を使うことで x-www-form-urlencoded 形式で送信します
      body: new URLSearchParams({
        url: url,
        cookies: "", // 必要なければ空でOK
        cookies_file: "" // 必要なければ空でOK
      })
    });

    const data = await response.json();
    
    // 成功・失敗に関わらずデータをフロントに返す
    return res.status(200).json(data);

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "抽出に失敗しました: " + error.message });
  }
}
