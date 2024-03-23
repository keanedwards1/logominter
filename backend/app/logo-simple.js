/* og code: */

/* async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2",
		{
			headers: { Authorization: "Bearer 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" },
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
    const path = "./images/image.png"; // Specify the path where you want to save the image
    fs.writeFileSync(path, result); // Write the image to the specified path
    
    return path; // Return the path of the saved image
}

query({"inputs": "LogoRedmAF, Icons " + "Fitness app logo, depicting an abstract figure in motion, vibrant colors"}).then((path) => {
    console.log("Image saved at: ", path);
}).catch((error) => {
    console.error("Error saving image: ", error);
});