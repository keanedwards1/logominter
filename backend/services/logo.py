import requests
import io
from PIL import Image

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

image_bytes = query({
    "inputs": "LogoRedmAF, Icons, create a circle of this back-ground color: rgb(242, 234, 214), with a complementary color as the leaf of a mint plant, rounded and animation like leaves, simple leaves",
})

    # Use detailed, minimalist, colorful, black and white as tags
    # LogoRedmAF, Icons

try:
    # Load the image from the bytes
    image = Image.open(io.BytesIO(image_bytes))
    
    # Save the image to the same directory as the script
    filename = "out.png"  # You can choose a different file name or extension if needed
    image.save(filename)
    print(f"Image saved to {filename}")
except IOError as e:
    print("An error occurred while trying to open or save the image:", e)