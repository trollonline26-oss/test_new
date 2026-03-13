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
    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        console.log(`Starting download for: ${videoUrl}`);
        
        // Get video info first to get the title
        const output = await exec(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ]
        });

        const videoInfo = JSON.parse(output.stdout);
        const title = videoInfo.title.replace(/[^\w\s]/gi, ''); // Sanitize title

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // Stream the download
        // Note: yt-dlp-exec doesn't directly return a stream usually, 
        // but we can use child_process or a slightly different approach if needed.
        // For simplicity in this demo, we'll use the binary directly via spawn if needed,
        // but let's try to pipe it.
        
        const { spawn } = require('child_process');
        const ls = spawn('yt-dlp', [
            '-o', '-', 
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--no-playlist',
            videoUrl
        ]);

        ls.stdout.pipe(res);

        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`Process exited with code ${code}`);
        });

    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Error downloading video: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
