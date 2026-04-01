export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    const apiKey = process.env.RAPIDAPI_KEY;

    // デバッグ用ログ（VercelのLogsで確認可能。キーの最初の3文字だけ表示）
    console.log("使用中のキー(頭3文字):", apiKey ? apiKey.substring(0, 3) : "未設定");

    // URLからIDを抽出
    const tweetId = url.split("/status/")[1]?.split("?")[0];
    if (!tweetId) return res.status(400).json({ error: "URL形式が正しくありません" });

    // Twttr API (twitter241) の公式設定に100%合わせる
    const response = await fetch(`https://twitter241.p.rapidapi.com/tweet?id=${tweetId}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "twitter241.p.rapidapi.com" // ここが1文字でも違うとはねられます
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
