document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', sendPromptOne);

  const generatedLogo = document.getElementById('generated-logo');
  const logoContainer = document.getElementById('generated-logo-container');

  // Check for saved image on page load
  const savedImage = localStorage.getItem('savedLogo');
  if (savedImage && generatedLogo && logoContainer) {
    generatedLogo.src = savedImage;
    logoContainer.style.display = 'flex';
  } else if (logoContainer) {
    logoContainer.style.display = 'none';
  }

  const downloadButton = document.getElementById('download-button');
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadCurrentImage);
  } else {
    console.error('Download button not found');
  }
});


function downloadCurrentImage() {
  // Try to get the image from localStorage first
  let imageData = localStorage.getItem('savedLogo');

  // If not in localStorage, get it from the img element
  if (!imageData) {
    const generatedLogo = document.getElementById('generated-logo');
    if (generatedLogo && generatedLogo.src) {
      imageData = generatedLogo.src;
    }
  }

  // If we have image data, initiate the download
  if (imageData) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'generated_logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('No image data found to download');
    alert('No image available to download. Please generate a logo first.');
  }
}


async function sendPromptOne() {
  const imageOfInput = document.querySelector('input[name="Image Of"]');
  const backgroundInput = document.querySelector('input[name="Background"]');
  const colorSelect = document.querySelector('select[title="color"]');
  const lightingSelect = document.querySelector('select[title="lighting and time of day"]');
  const styleSelect = document.querySelector('select[title="style and technique"]');
  const artistSelect = document.querySelector('select[title="artist"]');

  const prompt = `Imagine a simple logo using the style of vector art with a mono-colored background of ${imageOfInput.value}. In the background, there is ${backgroundInput.value},
                  with pronounced ${colorSelect.value}, and bathed in a beautiful ${lightingSelect.value} lighting. 
                  The style is reminiscent of ${styleSelect.value}, in the artistic style of ${artistSelect.value}.`;

  try {
    const response = await fetch('https://api.logominter.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64data = reader.result;

      // Save to local storage
      localStorage.setItem('savedLogo', base64data);

      const generatedLogo = document.getElementById('generated-logo');
      const logoContainer = document.getElementById('generated-logo-container');

      if (generatedLogo) {
        generatedLogo.src = base64data;
      } else {
        console.error('Element with id "generated-logo" not found');
      }

      if (logoContainer) {
        logoContainer.style.display = 'flex';
      } else {
        console.error('Element with id "generated-logo-container" not found');
      }
    }

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while generating the logo. Please try again.');
  }
}


/* document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit-button");
  const stripe = Stripe(
    "pk_test_51OxMMsAXpFBkWrM5u2vjHetldxTDnQuy5QTlNrWWgswAbhdrGVUtl6VUFT7NbIKpEtJet9OusmvVmsHpEUHwvS8g00mtMhzn5m"
  );

  if (submitButton) {
    submitButton.addEventListener("click", async function () {
      const prompt = gatherPrompt();

      function gatherPrompt() {
        const mainObjectElement = document.querySelector(
          'input[name="Image Of"]'
        );
        const mainObject = mainObjectElement ? mainObjectElement.value : "";

        const backgroundElement = document.querySelector(
          'input[name="Background"]'
        );
        const background = backgroundElement ? backgroundElement.value : "";

        const colorElement = document.querySelector('select[title="color"]');
        const color = colorElement ? colorElement.value : "";

        const lightingElement = document.querySelector(
          'select[title="lighting and time of day"]'
        );
        const lighting = lightingElement ? lightingElement.value : "";

        const styleElement = document.querySelector(
          'select[title="style and technique"]'
        );
        const style = styleElement ? styleElement.value : "";

        const atmosphereElement = document.querySelector(
          'select[title="emotion and atmosphere"]'
        );
        const atmosphere = atmosphereElement ? atmosphereElement.value : "";

        const artistElement = document.querySelector(
          'select[title="artist"]'
        );
        const artist = artistElement ? artistElement.value : "";

        const compositionElement = document.querySelector(
          'select[title="composition"]'
        );
        const composition = compositionElement ? compositionElement.value : "";

        let prompt = `Imagine a logo of ${mainObject}`;
        if (atmosphere) prompt += `, with a ${atmosphere} atmostphere`;
        if (lighting) prompt += `, and bathed in a beautiful ${lighting} lighting`;
        if (background) prompt += `. In the background, there is ${background}`;
        if (style) prompt += `. The style is reminiscent of ${style}`;
        if (color) prompt += `, with pronounced ${color} perfectly capturing the mood of the scene`;
        if (composition) prompt += `. The ${composition} composition draws the viewers eyes towards ${mainObject}`;
        if (artist) prompt += `, in the artistic style of ${artist}`;

        console.log("Normal Prompt: " + prompt); // Debugging
        return prompt;
      }

      const jsonPrompt = JSON.stringify(prompt);
      console.log("JSON Prompt: " + jsonPrompt);

      localStorage.setItem("prompt", jsonPrompt);

    });
  }
});
 */