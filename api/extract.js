export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Vercelの環境変数からAPIキーを読み込む
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Vercelの設定に RAPIDAPI_KEY が登録されていません。" });
    }

    // RapidAPI の Twitter抽出APIにリクエスト
    const response = await fetch("https://twitter-video-downloader-api.p.rapidapi.com/index", {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "twitter-video-downloader-api.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ url: url })
    });

    const data = await response.json();
    
    // APIからの結果をそのまま返す
    return res.status(200).json(data);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "抽出に失敗しました: " + error.message });
  }
}
