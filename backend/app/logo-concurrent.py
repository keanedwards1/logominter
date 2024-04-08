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
    filename = '_'.join(prompt.split()[:10])

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
        "dadaism painting of a runner with background blue , highly detailed, daylight, colorful",
        "de stijl Painting of a runner with background blue , highly detailed, daylight, colorful",
        "der blaue Painting of a runner with background blue , highly detailed, daylight, colorful",
        "digital Painting of a runner with background blue , highly detailed, daylight, colorful",
        "drIp Painting of a runner with background blue , highly detailed, daylight, colorful",
        "enamel Painting of a runner with background blue , highly detailed, daylight, colorful",
        "encaustic painting Painting of a runner with background blue , highly detailed, daylight, colorful",
        "expressionism Painting of a runner with background blue , highly detailed, daylight, colorful",
        "figurativism Painting of a runner with background blue , highly detailed, daylight, colorful",
        "finger Painting of a runner with background blue , highly detailed, daylight, colorful",
        "fresco secco of a runner with background blue , highly detailed, daylight, colorful"
        "futurism painting of a runner with background blue , highly detailed, daylight, colorful"
        "genre Painting of a runner with background blue , highly detailed, daylight, colorful"
        "glitter glue Painting of a runner with background blue , highly detailed, daylight, colorful"
        "gothic Painting of a runner with background blue , highly detailed, daylight, colorful"
        "gouache Painting of a runner with background blue , highly detailed, daylight, colorful"
        "history Painting of a runner with background blue , highly detailed, daylight, colorful"
        "hot wax Painting of a runner with background blue , highly detailed, daylight, colorful"
        "impressionsim Painting of a runner with background blue , highly detailed, daylight, colorful"
        "ink wash Painting of a runner with background blue , highly detailed, daylight, colorful"
    ]


def run_program_concurrently(times=20):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(20)
