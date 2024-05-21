// api/option-1.js

const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createCanvas, Image } = require('canvas');
require('dotenv').config();

const app = express();
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2";
const headers = { "Authorization": `Bearer ${process.env.API_KEY}` };

const requestStatus = {};

async function query(payload) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
            timeout: 30000 // Increase timeout to 30 seconds
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

async function generateLogo(prompt, requestId) {
    const imageBuffer = await query({ "inputs": `LogoRedmAF, Icons, ${prompt}` });
    if (imageBuffer) {
        requestStatus[requestId] = { status: 'completed', imageBuffer };
    } else {
        requestStatus[requestId] = { status: 'failed' };
    }
}

app.post('/api/option-1', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ detail: "Prompt not provided." });
        }

        const requestId = Date.now().toString(); // Use timestamp or a UUID library to generate a unique ID
        requestStatus[requestId] = { status: 'processing' };

        generateLogo(prompt, requestId); // Start the image generation in the background

        return res.status(202).json({
            status: "processing",
            message: "Image generation started.",
            requestId
        });
    } catch (error) {
        console.error(`Unexpected error: ${error}`);
        return res.status(500).json({ detail: `Internal Server Error: ${error.message}` });
    }
});
