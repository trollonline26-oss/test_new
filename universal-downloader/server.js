const express = require('express');
const cors = require('cors');
const { exec } = require('yt-dlp-exec');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL is required');

    try {
        console.log(`Starting stealth download for: ${videoUrl}`);
        
        // Sanitize a generic filename (we'll skip the extra JSON call to avoid the bot-block)
        const filename = "video_" + Date.now() + ".mp4";

        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Type', 'video/mp4');

        const { spawn } = require('child_process');
        
        // Android client is the most reliable for bypassing bot-checks on cloud IPs
        const ls = spawn('yt-dlp', [
            '-o', '-', 
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--no-playlist',
            '--no-check-certificates',
            '--extractor-args', 'youtube:player-client=android',
            videoUrl
        ]);

        ls.stdout.pipe(res);

        ls.stderr.on('data', (data) => {
            const msg = data.toString();
            console.error(`yt-dlp log: ${msg}`);
        });

        ls.on('close', (code) => {
            console.log(`Download process finished with code ${code}`);
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
