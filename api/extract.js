export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    
    // Vercelの設定からAPIキーを読み込む
    const apiKey = process.env.RAPIDAPI_KEY;

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
    
    // APIからのレスポンスをフロントエンドにそのまま返す
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "抽出に失敗しました: " + error.message });
  }
}
