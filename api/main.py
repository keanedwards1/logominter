from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import os
import io
import json
import aiohttp
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": f"Bearer {os.getenv('API_KEY')}"}

app = FastAPI()

async def query(payload):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(API_URL, headers=headers, json=payload) as response:
                response.raise_for_status()
                return await response.read()
        except aiohttp.ClientError as e:
            print(f"Request failed: {e}")
            return None

async def generate_logo(prompt):
    image_bytes = await query({"inputs": f"LogoRedmAF, Icons, {prompt}"})
    if image_bytes:
        return image_bytes
    else:
        print("Failed to generate logo.")
        return None

def save_image(image_bytes, prompt):
    if image_bytes is None:
        return None

    filename = '_'.join(prompt.split()[:10]) + '.png'
    file_path = os.path.join('/tmp', filename)

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.save(file_path)
        return file_path
    except IOError as e:
        print(f"Error saving image: {e}")
        return None

@app.post("/api/option-1")
async def handle_request(request: Request):
    try:
        data = await request.json()
        prompt = data.get('prompt')
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt not provided.")
        
        image_bytes = await generate_logo(prompt)
        if image_bytes:
            file_path = save_image(image_bytes, prompt)
            if file_path:
                return JSONResponse(status_code=200, content={
                    "status": "success",
                    "message": "Image generated and saved successfully.",
                    "file_path": file_path
                })
            else:
                raise HTTPException(status_code=500, detail="Failed to save image.")
        else:
            raise HTTPException(status_code=500, detail="Failed to generate image.")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
