from http.server import BaseHTTPRequestHandler
import json
import yt_dlp

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        url = data.get('url')

        # yt-dlp の設定
        ydl_opts = {
            'format': 'best', # 最高画質
            'quiet': True,
            'no_warnings': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # 動画情報を抽出
                info = ydl.extract_info(url, download=False)
                
                # 直リンクを取得
                video_url = info.get('url')
                thumbnail = info.get('thumbnail')
                title = info.get('title', '無題の動画')

                res_body = json.dumps({
                    "status": "success",
                    "url": video_url,
                    "thumbnail": thumbnail,
                    "title": title
                })

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # CORS許可
            self.end_headers()
            self.wfile.write(res_body.encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
