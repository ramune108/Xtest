export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // URLからツイートID（数字）を抜き出す
    // 例: https://x.com/user/status/1841380... -> 1841380...
    const tweetId = url.split("/status/")[1]?.split("?")[0];
    if (!tweetId) return res.status(400).json({ error: "URLからツイートIDを取得できませんでした" });

    const apiKey = process.env.RAPIDAPI_KEY;

    // Twttr API (twitter241) のエンドポイントを叩く
    const response = await fetch(`https://twitter241.p.rapidapi.com/tweet?id=${tweetId}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "twitter241.p.rapidapi.com"
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
