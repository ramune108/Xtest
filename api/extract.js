export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    
    // 本家ではなく、有志が公開している「オープンなサーバー」を使います
    // ここを以下のいずれかに書き換えて試してみてください
    const COBALT_INSTANCE = "https://cobalt.kwiateusz.com/"; 

    const response = await fetch(COBALT_INSTANCE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        downloadMode: "video"
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
