// server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" })); // Large video support

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GH_TOKEN;
const OWNER = "developersuman131";
const REPO = "video-storage";

// Upload video endpoint
app.post("/upload", async (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ success: false, error: "Filename or content missing" });
  }

  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`;
    const response = await axios.put(
      url,
      {
        message: `Upload ${filename}`,
        content
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    res.json({ success: true, download_url: response.data.content.download_url });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
  }
});

// List all videos
app.get("/list", async (req, res) => {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/videos`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });

    const videos = response.data.map(f => ({
      name: f.name,
      url: f.download_url
    }));

    res.json({ success: true, videos });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
