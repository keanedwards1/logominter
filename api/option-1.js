const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
require('dotenv').config();

const app = express();
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2";
const headers = { "Authorization": `Bearer ${process.env.API_KEY}` };

async function query(payload) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.buffer();
    } catch (error) {
        console.error(`Request failed: ${error}`);
        return null;
    }
}

async function generateLogo(prompt) {
    const imageBuffer = await query({ "inputs": `LogoRedmAF, Icons, ${prompt}` });
    if (imageBuffer) {
        return imageBuffer;
    } else {
        console.error("Failed to generate logo.");
        return null;
    }
}

function saveImage(imageBuffer, prompt) {
    if (!imageBuffer) {
        return null;
    }

    const filename = `${prompt.split(' ').slice(0, 10).join('_')}.png`;
    const filePath = path.join('/tmp', filename);

    try {
        const image = new Canvas.Image();
        image.src = imageBuffer;
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log('Image saved.'));
        return filePath;
    } catch (error) {
        console.error(`Error saving image: ${error}`);
        return null;
    }
}

app.post('/api/option-1.js', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ detail: "Prompt not provided." });
        }

        const imageBuffer = await generateLogo(prompt);
        if (imageBuffer) {
            const filePath = saveImage(imageBuffer, prompt);
            if (filePath) {
                return res.status(200).json({
                    status: "success",
                    message: "Image generated and saved successfully.",
                    file_path: filePath
                });
            } else {
                return res.status(500).json({ detail: "Failed to save image." });
            }
        } else {
            return res.status(500).json({ detail: "Failed to generate image." });
        }
    } catch (error) {
        console.error(`Unexpected error: ${error}`);
        return res.status(500).json({ detail: `Internal Server Error: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
