import os
from PIL import Image

def resize_image(img, base_width=300):
    # Calculate the height to maintain aspect ratio
    w_percent = (base_width / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    return img.resize((base_width, h_size), Image.LANCZOS)

def resize_images(folder_path, output_folder, base_width=300):
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Iterate through all files in the folder
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.png'):
            # Open the image
            img_path = os.path.join(folder_path, filename)
            with Image.open(img_path) as img:
                # Resize the image
                img_resized = resize_image(img, base_width)
                
                # Save the resized image
                output_path = os.path.join(output_folder, f"resized_{filename}")
                img_resized.save(output_path)
                print(f"Resized {filename} to {img_resized.size}")

# Usage
folder_path = "/Users/kean.edwards/Desktop/logo-minter/logominter/frontend/images/logos-page"
output_folder = "/Users/kean.edwards/Desktop/logo-minter/logominter/frontend/images/logos-page/sm"
resize_images(folder_path, output_folder)