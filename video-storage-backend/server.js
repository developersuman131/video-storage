
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json({ limit: "200mb" })); // Large video support

const GITHUB_TOKEN = process.env.GH_TOKEN;
const OWNER = "developersuman131";
const REPO = "video-storage";

app.post("/upload", async (req, res) => {
    try {
        const { filename, content } = req.body;
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`;

        const response = await axios.put(
            url,
            { message: "Video upload", content },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        res.json({ success: true, download_url: response.data.content.download_url });
    } catch (err) {
        console.log(err.response?.data);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
