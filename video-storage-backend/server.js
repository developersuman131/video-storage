import express from "express";
import cors from "cors";
import axios from "axios";
import 'dotenv/config';

const app = express(); // <-- MUST declare app before using
app.use(cors());
app.use(express.json({ limit: "500mb" }));

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GH_TOKEN;
const OWNER = "developersuman131";
const REPO = "video-storage";

// Upload MP3 endpoint
app.post("/upload", async (req, res) => {
  const { filename, content, name, artist } = req.body;

  if (!filename || !content || !name || !artist) {
    return res.status(400).json({ success: false, error: "Filename, content, name, or artist missing" });
  }

  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/music/${filename}`;
    const response = await axios.put(
      url,
      { message: `Upload ${filename}`, content },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } }
    );

    res.json({ success: true, download_url: response.data.content.download_url, name, artist });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
  }
});

// List all MP3
app.get("/list", async (req, res) => {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/music`;
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });

    const music = response.data.map(f => ({
      name: f.name.split(".mp3")[0],
      artist: "Unknown",
      url: f.download_url
    }));

    res.json({ success: true, music });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data?.message || err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
