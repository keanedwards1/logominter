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


def save_image(image_bytes, prompt):
    if image_bytes is None:
        return

    # Extract the first five words from the prompt for the filename
    filename = '_'.join(prompt.split()[:5])

    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the path to the images folder
    image_dir = os.path.join(script_dir, "images")

    if not os.path.exists(image_dir):
        os.makedirs(image_dir)

    file_path = os.path.join(image_dir, f"{filename}.png")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.save(file_path)
        print(f"Image saved: {file_path}")
    except IOError as e:
        print(f"Error saving image: {e}")



def generate_and_save_image(prompt):
    image_bytes = generate_logo(prompt)
    if image_bytes:
        save_image(image_bytes, prompt)



def get_phrases():
    return [
        "A contemporary illustration with a minimalist style, soft pastel palette, and clean lines for a tranquil atmosphere. Flat colors with minimal shading reflect modern digital art influences.",
        "Minimalist design in a modern art style, using muted pastels and simple lines to evoke a sense of peace. The lack of complex detail underscores its sleek, contemporary look.",
        "Modern editorial-style illustration, characterized by a minimalist approach, soft pastels, and crisp lines, providing a soothing visual experience with a flat color scheme.",
        "Simplistic and modern artwork with gentle pastel hues and neat lines, offering a serene and restful vibe. The artwork avoids detailed shading for a contemporary feel.",
        "An illustration in a modern and streamlined style, featuring a palette of soft pastels and straightforward lines for a calming effect. The artwork captures the essence of current digital design trends.",
        "A modern, illustrative creation with a focus on minimalism, using a soft pastel color range and neat lines to promote tranquility. The flat color application hints at digital art's influence.",
        "An image with a minimalist and modern flair, sporting subdued pastel shades and uncluttered lines that calm the viewer. The piece reflects the modern digital art movement with its simplicity.",
        "Illustrative art piece in a modern and minimalist vein, utilizing a pastel color spectrum and clean line work for a serene visual. Flat colors and a lack of detail modernize the style.",
        "An editorial-style visual with a modern minimalist approach, showcasing soft pastels and straightforward lines for a calming presence. The style is indicative of contemporary illustration found in lifestyle branding.",
        "Artistic representation in a minimalist and modern fashion, comprising soft pastel tones and clear-cut lines, offering a serene ambiance. The artwork's flat colors and simplicity are inspired by modern digital art."
    ]


def run_program_concurrently(times=10):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(10)
