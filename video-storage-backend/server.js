// server.js
import express from 'express';
import fetch from 'node-fetch'; // ya built-in fetch in Node.js 18+
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const GH_TOKEN = process.env.GH_TOKEN;

app.use(bodyParser.json({ limit: '500mb' }));

// Upload endpoint
app.post("/upload", async (req, res) => {
  const { filename, content } = req.body;
  try {
    const response = await fetch(`https://api.github.com/repos/developersuman131/video-storage/contents/${filename}`, {
      method: "PUT",
      headers: { Authorization: `token ${GH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Upload ${filename}`, content })
    });
    const data = await response.json();
    if(data.content && data.content.download_url) {
      res.json({ success: true, download_url: data.content.download_url });
    } else {
      res.json({ success: false, error: data.message });
    }
  } catch(err) {
    res.json({ success: false, error: err.message });
  }
});

// List all videos
app.get("/list", async (req, res) => {
  try {
    const response = await fetch(`https://api.github.com/repos/developersuman131/video-storage/contents/videos`, {
      headers: { Authorization: `token ${GH_TOKEN}` }
    });
    const files = await response.json();
    const videos = files.map(f => ({ name: f.name, url: f.download_url }));
    res.json({ success: true, videos });
  } catch(err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
