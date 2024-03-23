# program to choose random prompts from an array of prompts 
# outputs images into the images folder with name of the prompt
# 

import os
import io
import requests
from PIL import Image
from random import choice
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": "Bearer {os.getenv('API_KEY')}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

def generate_logo(prompt):
    image_bytes = query({
        "inputs": f"Icons, {prompt}"
    })
    return image_bytes

def save_image(image_bytes, filename):
    image_dir = 'images'
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
    image = Image.open(io.BytesIO(image_bytes))
    file_path = os.path.join(image_dir, f'{filename}.png')
    image.save(file_path)
    print(f"Image saved: {file_path}")

def generate_prompt():
    # Define a list of common phrases for logo generation
    phrases = [
        'Dogs', 'dolphins', 'pandas', 'butterflies', 'birds', 'yoga', 
        'surfurs', 'boxing', 'skateboarding', 'tennis', 'harmony', 'zen vibes',
        'coffee', 'to go coffee mug warm and comfy coffee shop vibes, wooden colors, with views of nature',
        'cup of tea with steam', 'cup of coffee with steam',
        'hot coffee cozy vibes', 'nurses', 'doctor', 'film producer', 'programmer',
        'lawyer firm stark colors very professional', 'vet', 'teacher', 'flowers', 'hawaii beaches', 'hawaii mountains',
        'hawaii sunset', 'astrology signs', 'travel', 'plane', 'car', 'sailboat',
        'beach', 'beach with surf', 'beach with waves', 'beach with waves and surf',
        'passport', 'airplane in clouds'
    ]

    # Select a random phrase from the list
    prompt = choice(phrases)

    # single prompt:
    # prompt = 'ancient Anamorphosis Painting of a Film Producer, daylight, black & white'

    return prompt

def run_program(times=1):
    used_prompts = []
    for _ in range(times):
        # Generate a unique prompt
        prompt = generate_prompt()
        while prompt in used_prompts:
            prompt = generate_prompt()
        used_prompts.append(prompt)

        image_bytes = generate_logo(prompt)
        save_image(image_bytes, prompt.replace(" ", "_"))

# Run the program with the default of 6 times
run_program()