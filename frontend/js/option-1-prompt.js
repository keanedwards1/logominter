document.addEventListener("DOMContentLoaded", function () {
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

        const techniqueElement = document.querySelector(
          'select[title="technique"]'
        );
        const technique = techniqueElement ? techniqueElement.value : "";

        const compositionElement = document.querySelector(
          'select[title="composition"]'
        );
        const composition = compositionElement ? compositionElement.value : "";

        let prompt = `Image of: ${mainObject}`;
        if (background) prompt += `, Background: ${background}`;
        if (color) prompt += `, Color: ${color}`;
        if (lighting) prompt += `, Lighting: ${lighting}`;
        if (style) prompt += `, Style: ${style}`;
        if (atmosphere) prompt += `, Atmosphere: ${atmosphere}`;
        if (technique) prompt += `, Technique: ${technique}`;
        if (composition) prompt += `, Composition: ${composition}`;

        console.log(prompt); // Debugging

        return prompt;
      }

      // try {

      // const response = await fetch('/api/option-1', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ prompt: prompt })
      // });

      localStorage.setItem("prompt", JSON.stringify(prompt));

      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(errorText);
      // }

      // const data = await response.json();
      // console.log(data); // Debugging

      // if (data.status === 'processing') {
      //   console.log('Image generation started successfully.');

      stripe.redirectToCheckout({
        lineItems: [{ price: "price_1PINdIAXpFBkWrM5oJ41r2lg", quantity: 1 }],
        mode: "payment",
        // clientReferenceId: data.requestId, // Pass requestId as reference
        successUrl:
          window.location.origin +
          "/public/success.html?requestId=" +
          1222,
        cancelUrl: window.location.origin + "/public/option-1.html",
      });
      /*         } else {
          alert('Image generation failed: ' + data.message);
        } */
      // } catch (error) {
      //   console.error('Image generation error:', error);
      //   alert('An error occurred: ' + error.message);
      // }
    });
  }
});
