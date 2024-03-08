import os
import io
import requests
from PIL import Image
from random import choice

API_URL = "https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

def generate_logo(prompt):
    image_bytes = query({
        "inputs": f"LogoRedmAF, Icons, {prompt}"
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
        'letter p',
    ]

    # Select a random phrase from the list
    prompt = choice(phrases)

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