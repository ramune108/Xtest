export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    
    // Cobalt v10 の最新ルールに合わせて通信
    const response = await fetch("https://api.cobalt.tools/", { // 末尾の /api/json を削除
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json" // これが必須になりました
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        downloadMode: "video" // モードを明示的に指定
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
