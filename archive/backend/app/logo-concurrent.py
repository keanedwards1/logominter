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
        "Design a logo using the fractal pattern of a snowflake, emphasizing its symmetry and delicate structure. Use a color scheme of icy blues and whites to reflect the cold beauty of winter. The logo should be elegant and minimalist, suitable for a luxury winter apparel brand or an ice-themed event.",
        "Create a logo inspired by the Sierpinski Triangle, featuring recursive triangular shapes. Opt for a bold color contrast of black and vibrant red, symbolizing energy and passion. This logo is ideal for a tech startup or a company specializing in mathematical education.",
        "Generate a logo that resembles the intricate spirals of a Mandelbrot set. Use deep indigo and electric violet colors to give a sense of depth and mystery. The logo should appeal to a creative arts organization or a company focused on complex system solutions.",
        "Develop a logo inspired by the branching patterns of trees, mimicking the fractal structure of tree limbs. Use earth tones like green and brown to emphasize sustainability and growth, perfect for an eco-friendly brand or a nature conservation group.",
        "Craft a logo with the fractal patterns seen in coral reefs, using a palette of coral pinks and sea blues. This design would be ideal for a marine biology institute or an environmental NGO focused on ocean conservation.",
        "Design a logo based on the Julia set fractal, creating a dynamic and swirling abstract pattern. Utilize fiery oranges and yellows to convey energy and creativity, suitable for an innovative design studio or a creative workshop.",
        "Create a logo that abstracts the fractal geometry of mountain ranges, using shades of gray and white to mimic the appearance of rugged terrains. This logo would be perfect for an outdoor adventure brand or a mountain sports equipment company.",
        "Generate a logo that incorporates the fractal patterns of lightning strikes, using stark whites against a stormy gray background to evoke the power and unpredictability of storms. Ideal for a disaster management firm or an extreme weather forecasting service.",
        "Design a logo inspired by the repetitive patterns of Romanesco broccoli, featuring its natural spiral formations. Use vibrant greens and yellows to highlight organic growth, making it suitable for a health food brand or a vegetarian restaurant.",
        "Create a logo with the dynamic and fluid fractal patterns of river deltas, using blues and greens to represent water and life. This logo would be great for a water conservation NGO or a company specializing in hydrological studies."
    ]




def run_program_concurrently(times=5):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(20)
