const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 30000;

// serve frontend HTML
app.use(express.static(path.join(__dirname, "public")));

// API untuk crawl link
app.get("/crawl", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let links = [];

        $("a").each((i, el) => {
            let link = $(el).attr("href");
            if (link) {
                links.push(link);
            }
        });

        res.json(links);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to crawl website" });
    }
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

