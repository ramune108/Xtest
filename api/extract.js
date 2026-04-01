export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  // 現在稼働している可能性が高い予備サーバーのリスト
  const instances = [
    "https://cobalt-api.lunes.host/",
    "https://cobalt.api.0x0.st/",
    "https://api.cobalt.tools/", // 本家（時々動く）
    "https://cobalt.kwiateusz.com/"
  ];

  for (const instance of instances) {
    try {
      console.log(`試行中のサーバー: ${instance}`);
      const response = await fetch(instance, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          url: url,
          videoQuality: "720"
        }),
        signal: AbortSignal.timeout(5000) // 5秒でタイムアウトして次へ
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url || data.picker) {
          return res.status(200).json(data); // 成功したら即座に返す
        }
      }
    } catch (e) {
      console.log(`${instance} でエラー: ${e.message}`);
      continue; // エラーなら次のサーバーを試す
    }
  }

  // すべて失敗した場合
  return res.status(500).json({ 
    error: "現在すべての抽出サーバーが混み合っています。少し時間を置いてから再度お試しください。" 
  });
}
