document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submit-button');
  const stripe = Stripe('pk_live_51OxMMsAXpFBkWrM5X496rrJI4PzWFFW0ZAi77BLlN8VyOYJaDOKI2P3Xa1jaMiviRsFcNHdzbNt6OITW93ngAQcI00E9yQXxhL');

  if (submitButton) {
    submitButton.addEventListener('click', async function () {
      const prompt = gatherPrompt();

      function gatherPrompt() {
        const mainObjectElement = document.querySelector('input[name="Image Of"]');
        const mainObject = mainObjectElement ? mainObjectElement.value : '';

        const backgroundElement = document.querySelector('input[name="Background"]');
        const background = backgroundElement ? backgroundElement.value : '';

        const colorElement = document.querySelector('select[title="color"]');
        const color = colorElement ? colorElement.value : '';

        const lightingElement = document.querySelector('select[title="lighting and time of day"]');
        const lighting = lightingElement ? lightingElement.value : '';

        const styleElement = document.querySelector('select[title="style and technique"]');
        const style = styleElement ? styleElement.value : '';

        const atmosphereElement = document.querySelector('select[title="emotion and atmosphere"]');
        const atmosphere = atmosphereElement ? atmosphereElement.value : '';

        const techniqueElement = document.querySelector('select[title="technique"]');
        const technique = techniqueElement ? techniqueElement.value : '';

        const compositionElement = document.querySelector('select[title="composition"]');
        const composition = compositionElement ? compositionElement.value : '';

        let prompt = `Image of: ${mainObject}`;
        if (background) prompt += `, Background: ${background}`;
        if (color) prompt += `, Color: ${color}`;
        if (lighting) prompt += `, Lighting: ${lighting}`;
        if (style) prompt += `, Style: ${style}`;
        if (atmosphere) prompt += `, Atmosphere: ${atmosphere}`;
        if (technique) prompt += `, Technique: ${technique}`;
        if (composition) prompt += `, Composition: ${composition}`;

        return prompt;
      }

      try {
        const response = await fetch('/api/option-1.py', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        if (data.status === 'success') {
          console.log('Image generation started successfully.');

          stripe.redirectToCheckout({
            lineItems: [{ price: 'price_1PEyxHAXpFBkWrM5vopLJVQu', quantity: 1 }],
            mode: 'payment',
            clientReferenceId: data.file_path, // Pass image file path as reference
            successUrl: window.location.origin + '/frontend/html/success.html?payment_intent_client_secret={CHECKOUT_SESSION_ID}',
            cancelUrl: window.location.origin + '/frontend/html/cancel.html'
          });
        } else {
          alert('Image generation failed: ' + data.message);
        }
      } catch (error) {
        console.error('Image generation error:', error);
        alert('An error occurred: ' + error.message);
      }
    });
  }
});



  

/* function sendPromptOne() {
    // Function to gather form inputs and concatenate them into a prompt
    function gatherPrompt() {
        const mainObject = document.querySelector('input[name="Image Of"]').value;
        const background = document.querySelector('input[name="Background"]').value;
        const color = document.querySelector('select[title="color"]').value;
        const lighting = document.querySelector('select[title="lighting and time of day"]').value;
        const style = document.querySelector('select[title="style and technique"]').value;
        const atmosphere = document.querySelector('select[title="emotion and atmosphere"]').value;
        const technique = document.querySelector('select[title="technique"]').value;
        const composition = document.querySelector('select[title="composition"]').value;

        let prompt = `Image of: ${mainObject || ''}`;
        if (background) prompt += `, Background: ${background}`;
        if (color) prompt += `, Color: ${color}`;
        if (lighting) prompt += `, Lighting: ${lighting}`;
        if (style) prompt += `, Style: ${style}`;
        if (atmosphere) prompt += `, Atmosphere: ${atmosphere}`;
        if (technique) prompt += `, Technique: ${technique}`;
        if (composition) prompt += `, Composition: ${composition}`;

        return prompt;
    }

    // Function to handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        const prompt = gatherPrompt();

        try {
            const response = await fetch('/api/option-1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();
            alert(data.message);

            if (data.file_path) {
                const img = document.createElement('img');
                img.src = data.file_path.replace('../', '/');
                img.alt = 'Generated Logo';
                document.getElementById('result').appendChild(img);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Add event listener to the form if not already added
    const form = document.getElementById('logoForm');
    if (form && !form.hasAttribute('data-listener-added')) {
        form.addEventListener('submit', handleFormSubmit);
        form.setAttribute('data-listener-added', 'true');
    }
};
 */