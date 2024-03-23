# logo.py but runs all generations concurrently
# having some issues with image quality

import os
import io
import requests
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
from random import choice, shuffle
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": "Bearer {os.getenv('API_KEY')}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

def generate_logo(prompt):
    image_bytes = query({"inputs": f"LogoRedmAF, Icons, {prompt}"})
    return image_bytes

def save_image(image_bytes, filename):
    image_dir = "images"
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
    image = Image.open(io.BytesIO(image_bytes))
    file_path = os.path.join(image_dir, f"{filename}.png")
    image.save(file_path)
    print(f"Image saved: {file_path}")

def generate_and_save_image(prompt):
    image_bytes = generate_logo(prompt)
    save_image(image_bytes, prompt.replace(" ", "_"))

def get_phrases():
    # Your original list of phrases
    return [
        "Logo of playful dogs with paws, minimalist design",
        "Logo featuring jumping dolphins, abstract style",
        "Minimalist panda logo with bamboo",
        "Minimalist logo for a coffee shop, featuring a steaming cup and warm colors",
        "Eco-friendly brand logo with a green leaf and earth tones, sustainable vibe",
        "Tech startup logo, incorporating a circuit board pattern and modern font",
        "Adventure travel company logo with a compass and mountain, bold lines",
        "Health and wellness logo featuring a lotus flower and calming colors",
        "Sports brand logo with a dynamic figure running, sleek and energetic",
        "Children's book store logo, whimsical font and a flying book illustration",
        "Gourmet chocolate brand logo, featuring a cocoa pod and rich, dark colors",
        "Luxury real estate logo with a key and house silhouette, elegant design",
        "Pet care service logo, incorporating a heart and paw print, friendly feel",
        "Fitness app logo, depicting an abstract figure in motion, vibrant colors",
        "Craft brewery logo, featuring a beer mug and hops, vintage style",
        "Fashion boutique logo, minimalist hanger and chic font",
        "Environmental NGO logo, a globe embraced by leaves, conveying care",
        "Artisan bakery logo, a wheat sheaf and rustic loaf, earthy tones",
        "Cybersecurity firm logo, a shield and digital grid, bold and impactful",
        "Music streaming service logo, a note and sound waves, dynamic design",
        "Photography studio logo, a minimalist camera and flash, sleek black and white",
        "Yoga studio logo, a serene silhouette in a pose, soothing colors",
        "Gaming channel logo, a joystick and abstract pixels, lively and colorful",
     ]

def run_program_concurrently(times=23):
    phrases = get_phrases()
    shuffle(phrases)  # Shuffle the list to randomize the order
    selected_prompts = phrases[:times]  # Select the first 'times' number of prompts after shuffling
    
    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)

# Example usage to run the program 10 times concurrently
run_program_concurrently(23)