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
        "1 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "2 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "3 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "4 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "5 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "6 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "7 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "8 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "9 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "10 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "11 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "12 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "13 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "14 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "15 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "16 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "17 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "18 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "19 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
        "20 " + "Depict an alt rapper in a lavish portrait filled with gold leaf and intricate patterns, reminiscent of Gustav Klimt’s ornate style. Use a rich palette of golds, blacks, and deep reds. The background should include symbolic elements like musical notes and vinyl records, intertwined with the opulent decorative motifs that frame the rapper",
]


def run_program_concurrently(times=20):
    phrases = get_phrases()
    shuffle(phrases)
    selected_prompts = phrases[:times]

    with ThreadPoolExecutor(max_workers=times) as executor:
        executor.map(generate_and_save_image, selected_prompts)


# Example usage
run_program_concurrently(20)
