import os
import io
import requests
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
from random import shuffle
from dotenv import load_dotenv

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


def save_image(image_bytes, filename):
    if image_bytes is None:
        return

    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the path to the images folder
    image_dir = os.path.join(script_dir, "images")

    if not os.path.exists(image_dir):
        os.makedirs(image_dir)

    try:
        image = Image.open(io.BytesIO(image_bytes))
        file_path = os.path.join(image_dir, f"{filename}.png")
        image.save(file_path)
        print(f"Image saved: {file_path}")
    except IOError as e:
        print(f"Error saving image: {e}")


def generate_and_save_image(prompt):
    image_bytes = generate_logo(prompt)
    if image_bytes:
        save_image(image_bytes, prompt.replace(" ", "_"))


def get_phrases():
    return [
        "A minimalist climbing logo featuring a silhouette scaling a sharp peak, in monochrome shades to symbolize simplicity and focus.",
        "A vibrant, action-packed logo with a climber ascending colorful geometric shapes, drawing inspiration from pop art to convey energy and fun.",
        "An abstract climbing logo with intertwining ropes in shades of blue and white, reflecting a modern, sleek design ethos for elegance and safety.",
        "A vintage-inspired climbing logo, showcasing a classic mountaineer with an axe, set against a muted earth-toned background for a retro feel.",
        "A futuristic climbing logo, illustrating a climber with holographic gear against a dark, neon-lit background, merging technology with adventure.",
        "An eco-friendly climbing logo, composed of green and brown earth tones, incorporating leaf patterns to emphasize sustainability and connection to nature.",
        "A whimsical climbing logo, featuring a cartoonish climber and whimsical elements like floating islands, in pastel colors to express joy and imagination.",
        "A bold, street-art style climbing logo with a graffiti-inspired climber on a textured urban wall background, mixing rebellion with urban culture.",
        "A serene, watercolor climbing logo, depicting a peaceful climb in a mountainous landscape, using soft washes of color to evoke calm and tranquility.",
        "A high-contrast, noir-inspired climbing logo, with a spotlight on a climber against a pitch-black background, highlighting drama and the climber’s determination."
    ]


def run_program_concurrently(times=10):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(10)
