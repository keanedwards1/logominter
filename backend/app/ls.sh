#!/bin/bash

# Update the target directory to your specified path
IMAGE_DIR="/Users/kean.edwards/Desktop/logo-minter/logominter/backend/app/images"
IMAGE_NAME="logo.png"
API_URL="https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
AUTH_TOKEN="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"

# Ensure the target directory exists
mkdir -p "$IMAGE_DIR"

# Use curl to call the API and save the response as an image file
curl -X POST "$API_URL" \
     -d '{"inputs": "LogoRedmAF, Icons Fitness app logo, depicting an abstract figure in motion, vibrant colors"}' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     --output "${IMAGE_DIR}/${IMAGE_NAME}"
