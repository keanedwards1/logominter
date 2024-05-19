import os
import io
import json
import aiohttp
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
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
async def handler(request: Request):
    try:
        data = await request.json()
        prompt = data.get('prompt')
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt not provided.")

        image_bytes = await generate_logo(prompt)
        if not image_bytes:
            raise HTTPException(status_code=500, detail="Failed to generate image.")

        file_path = save_image(image_bytes, prompt)
        if not file_path:
            raise HTTPException(status_code=500, detail="Failed to save image.")

        return JSONResponse(status_code=200, content={
            "status": "success",
            "message": "Image generated and saved successfully.",
            "file_path": file_path
        })

    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")





""" import os // run locally
import io
import json
import requests
from PIL import Image
from dotenv import load_dotenv
from http.server import BaseHTTPRequestHandler

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": f"Bearer {os.getenv('API_KEY')}"}


def query(payload):
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  # This will raise an HTTPError for bad requests (4XX or 5XX)
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None


def generate_logo(prompt):
    image_bytes = query({"inputs": f"LogoRedmAF, Icons, {prompt}"})
    if image_bytes:
        return image_bytes
    else:
        print("Failed to generate logo.")
        return None


def save_image(image_bytes, prompt):
    if image_bytes is None:
        return None

    # Extract the first ten words from the prompt for the filename
    filename = '_'.join(prompt.split()[:10])

    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the path to the images folder
    image_dir = os.path.join(script_dir, "../images")

    if not os.path.exists(image_dir):
        os.makedirs(image_dir)

    file_path = os.path.join(image_dir, f"{filename}.png")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.save(file_path)
        return file_path
    except IOError as e:
        print(f"Error saving image: {e}")
        return None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        prompt = data.get('prompt')
        if prompt:
            image_bytes = generate_logo(prompt)
            if image_bytes:
                file_path = save_image(image_bytes, prompt)
                if file_path:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "status": "success",
                        "message": "Image generated and saved successfully.",
                        "file_path": file_path.replace('../', '/')
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "status": "error",
                        "message": "Failed to save image."
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
            else:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "status": "error",
                    "message": "Failed to generate image."
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "error",
                "message": "Prompt not provided."
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
 """