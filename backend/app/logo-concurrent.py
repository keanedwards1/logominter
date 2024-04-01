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
        "the world is your oyster",
        "a ravishing girl with dark brown hair and blonde higlights greets people as they enter her restaurant, she is loved by her coworkers and treats all her customers with kindness and a smile",
        "a woman wearing black and white tuxedo and a leather jacket and boots",
        "an art deco painting of a white calico cat in ancient egypy perched on a stone wall wearing a golden crown",
        "twice thought of and twice removed, site quitely like something that has never been seen before",
        "ages ago and never before or since seen, a quite egg is laying lavishly in the sun",
    ]


def run_program_concurrently(times=6):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(6)
