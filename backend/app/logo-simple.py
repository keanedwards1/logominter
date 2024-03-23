import os
import requests
from PIL import Image
import io
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": "Bearer {os.getenv('API_KEY')}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

# Make sure the /images directory exists
images_dir = os.path.join(os.path.dirname(__file__), 'images')
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

image_bytes = query({
    "inputs": "LogoRedmAF, Icons Stunning Hawaii Sunset",
})

# Load the image from bytes
image = Image.open(io.BytesIO(image_bytes))

# Define the path for the image
image_path = os.path.join(images_dir, 'output_image.jpg')

# Save the image
image.save(image_path)

print(f"Image saved to {image_path}")