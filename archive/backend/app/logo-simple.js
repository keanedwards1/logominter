/* og code: */

/* async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2",
		{
			headers: { Authorization: "Bearer <REVOKED_HUGGINGFACE_TOKEN>" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
query({"inputs": "LogoRedmAF, Icons " + "Astronaut riding a horse"}).then((response) => {
	// Do something with image
}); */

require('dotenv').config(); // Load environment variables from .env file

const fetch = require('node-fetch');
const fs = require('fs');

async function query(data) {
    const response = await fetch(
        process.env.API_URL,
        {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.buffer(); // Use buffer() instead of blob()

    // Save the image to /images folder
    const path = "/Users/kean.edwards/Desktop/logo-minter/logominter/backend/app/images"; // Specify the path where you want to save the image
    fs.writeFileSync(path, result); // Write the image to the specified path
    
    return path; // Return the path of the saved image
}

query({"inputs": "LogoRedmAF, Icons " + "modern and illustrative, with a minimalist approach. It features soft pastel colors and clean lines, giving it a calming and serene aesthetic. The use of flat colors and minimal shading suggests an influence from the contemporary digital art scene. There's also a noticeable absence of intricate detail which lends to its modern simplicity. The character's closed eyes and relaxed posture evoke a sense of tranquility. This style is often associated with modern editorial illustrations that you might find in lifestyle magazines or as part of branding for wellness and beauty products."}).then((path) => {
    console.log("Image saved at: ", path);
}).catch((error) => {
    console.error("Error saving image: ", error);
});