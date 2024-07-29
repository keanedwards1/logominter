// api/check-status.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createCanvas, Image } = require('canvas');
require('dotenv').config();

const app = express();
app.use(express.json());

const requestStatus = {}; // This should be shared or persisted appropriately

app.get('/api/check-status', async (req, res) => {
    const { requestId } = req.query;

    if (!requestId || !requestStatus[requestId]) {
        return res.status(400).json({ detail: "Invalid or missing requestId." });
    }

    const status = requestStatus[requestId];

    if (status.status === 'completed') {
        const filePath = await saveImage(status.imageBuffer, requestId);
        if (filePath) {
            return res.status(200).json({
                status: "success",
                message: "Image generated and saved successfully.",
                file_path: filePath
            });
        } else {
            return res.status(500).json({ detail: "Failed to save image." });
        }
    } else if (status.status === 'failed') {
        return res.status(500).json({ detail: "Failed to generate image." });
    } else {
        return res.status(202).json({ status: "processing" });
    }
});

function saveImage(imageBuffer, requestId) {
    const filename = `${requestId}.png`;
    const filePath = path.join(os.tmpdir(), filename);

    try {
        const image = new Image();
        image.src = imageBuffer;
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        return new Promise((resolve, reject) => {
            out.on('finish', () => resolve(filePath));
            out.on('error', (error) => {
                console.error(`Error saving image: ${error}`);
                reject(null);
            });
        });
    } catch (error) {
        console.error(`Error saving image: ${error}`);
        return null;
    }
}

// Export the Express app to be used as a serverless function
module.exports = app;
