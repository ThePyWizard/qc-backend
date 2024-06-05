const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/download', async (req, res) => {
    const { url, startTime, endTime } = req.body;
    if (!url ||!startTime ||!endTime) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const videoStream = ytdl(url, { start: startTime, end: endTime });
        const videoName = 'output.mp4';
        const downloadPath = './downloads/';

        videoStream.pipe(fs.createWriteStream(`${downloadPath}${videoName}`));

        videoStream.on('finish', () => {
            fs.unlinkSync(`${downloadPath}${videoName}`);
            res.download(`${downloadPath}${videoName}`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error downloading video');
                } else {
                    console.log('Video downloaded successfully');
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to download video');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
