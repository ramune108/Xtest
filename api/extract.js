export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    const apiKey = process.env.RAPIDAPI_KEY;

    // All Media Downloader (all-media-downloader1) の設定
    // GETリクエストでURLを送る形式です
    const response = await fetch(`https://all-media-downloader1.p.rapidapi.com/get?url=${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "all-media-downloader1.p.rapidapi.com"
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
