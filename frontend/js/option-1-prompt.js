document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', sendPromptOne);

  const generatedLogo = document.getElementById('generated-logo');
  const logoContainer = document.getElementById('generated-logo-container');
  const loaderContainer = document.getElementById('loader-container');

  // Check for saved image on page load
  const savedImageData = localStorage.getItem('savedLogoData');
  if (savedImageData) {
    const { image, timestamp } = JSON.parse(savedImageData);
    const currentTime = new Date().getTime();
    if (currentTime - timestamp < 3600000) { // 3600000 ms = 1 hour
      if (generatedLogo && logoContainer) {
        generatedLogo.src = image;
        logoContainer.style.display = 'flex';
        loaderContainer.style.display = 'none';
      }
    } else {
      localStorage.removeItem('savedLogoData');
      logoContainer.style.display = 'none';
      loaderContainer.style.display = 'none';
    }
  } else {
    logoContainer.style.display = 'none';
    loaderContainer.style.display = 'none';
  }

  const downloadButton = document.getElementById('download-button');
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadCurrentImage);
  } else {
    console.error('Download button not found');
  }
});

function downloadCurrentImage() {
  let imageData;
  const savedImageData = localStorage.getItem('savedLogoData');
  if (savedImageData) {
    const { image, timestamp } = JSON.parse(savedImageData);
    const currentTime = new Date().getTime();
    if (currentTime - timestamp < 3600000) { // 3600000 ms = 1 hour
      imageData = image;
    }
  }

  if (!imageData) {
    const generatedLogo = document.getElementById('generated-logo');
    if (generatedLogo && generatedLogo.src) {
      imageData = generatedLogo.src;
    }
  }

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
  const submitButton = document.getElementById('submit-button');
  const statusMessage = document.getElementById('status-message');
  
  // Disable the submit button and show "Generating..." text
  submitButton.classList.add('disabled');
  submitButton.querySelector('.button-top').textContent = 'Generating...';

  // Initialize counter
  let counter = 15;

  // Function to update status message
  function updateStatusMessage() {
    if (submitButton.classList.contains('disabled')) {
      statusMessage.textContent = `Estimated time to generate logo: ${counter} seconds`;
      statusMessage.style.display = 'block';
      statusMessage.style.color = 'black';
      
      if (counter > 0) {
        counter--;
        setTimeout(updateStatusMessage, 1000); // Update every second
      }
    }
  }

  // Start updating status message
  updateStatusMessage();

  // Rest of your code remains the same
  const imageOfInput = document.querySelector('input[name="Image Of"]');
  const backgroundInput = document.querySelector('input[name="Background"]');
  const colorSelect = document.querySelector('select[title="color"]');
  const lightingSelect = document.querySelector('select[title="lighting and time of day"]');
  const styleSelect = document.querySelector('select[title="style and technique"]');
  const artistSelect = document.querySelector('select[title="artist"]');

  const prompt = `Imagine a simple logo using the style of vector art with a mono-colored background of ${imageOfInput.value}. In the background, there is ${backgroundInput.value},
                  with pronounced ${colorSelect.value}, and bathed in a beautiful ${lightingSelect.value} lighting. 
                  The style is reminiscent of ${styleSelect.value}, in the artistic style of ${artistSelect.value}.`;

  // Show loader
  document.getElementById('generated-logo-container').style.display = 'none';
  document.getElementById('loader-container').style.display = 'flex';

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

      // Save to local storage with timestamp
      const savedLogoData = {
        image: base64data,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('savedLogoData', JSON.stringify(savedLogoData));

      const generatedLogo = document.getElementById('generated-logo');
      const logoContainer = document.getElementById('generated-logo-container');

      if (generatedLogo) {
        generatedLogo.src = base64data;
      } else {
        console.error('Element with id "generated-logo" not found');
      }

      // Hide loader and show logo container
      document.getElementById('loader-container').style.display = 'none';
      if (logoContainer) {
        logoContainer.style.display = 'flex';
      } else {
        console.error('Element with id "generated-logo-container" not found');
      }

      // Reset submit button
      submitButton.classList.remove('disabled');
      submitButton.querySelector('.button-top').textContent = 'Submit';

      // Clear status message
      statusMessage.style.display = 'none';
    }

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error:', error);
    
    // Display error message
    statusMessage.textContent = 'An error occurred while generating the logo. Please try again.';
    statusMessage.style.display = 'block';
    statusMessage.style.color = 'red';

    // Hide loader on error
    document.getElementById('loader-container').style.display = 'none';

    // Reset submit button
    submitButton.classList.remove('disabled');
    submitButton.querySelector('.button-top').textContent = 'Submit';
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