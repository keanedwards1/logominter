let imgElement = document.getElementById("generated-image");

document.addEventListener("DOMContentLoaded", async function () {
  /*   const urlParams = new URLSearchParams(window.location.search);
   */ /*   const clientSecret = urlParams.get('payment_intent_client_secret');
  const requestId = urlParams.get('requestId'); */
  let prompt = localStorage.getItem("prompt");
  prompt = JSON.parse(prompt);
  setTimeout(async  () => {
    const response = await fetch("/api/option-1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });
    let resp2 = await response.json(); 
    console.log(resp2);

    const imageData = resp2.image.data; // Base64 or binary image data
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
    // Create an Object URL for the Blob
    const imageUrl = URL.createObjectURL(blob);
  
    // Set the Object URL as the src of the img element
    imgElement.src = imageUrl;

    return;
  }, 30 * 1000);



  
  // console.log('Client secret from URL:', clientSecret); // Debugging line
  // console.log('Request ID from URL:', requestId); // Debugging line

  // if (clientSecret) {
  //   const paymentIntent = await fetchPaymentIntent(clientSecret);
  //   if (paymentIntent && paymentIntent.status === 'succeeded') {
  //     await fetchGeneratedImage(paymentIntent.client_reference_id);
  //   } else {
  //     console.error('Payment not successful:', paymentIntent);
  //     // Handle error or redirect to error page
  //   }
  // } else {
  //   console.error('No payment_intent_client_secret found in URL.');
  //   // Handle error or redirect to error page
  // }

  // if (requestId) {
  //   await pollStatus(requestId);
  // } else {
  //   console.error('No requestId found in URL');
  // }
});

async function fetchPaymentIntent(clientSecret) {
  console.log("Fetching payment intent for client secret:", clientSecret); // Debugging line
  try {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return null;
  }
}

async function fetchGeneratedImage(clientReferenceId) {
  try {
    const response = await fetch(
      `/api/get-image?file_path=${clientReferenceId}`,
      { method: "GET" }
    );
    const data = await response.json();

    if (data.status === "success" && data.file_path) {
      const imageUrl = data.file_path;
      const displayedImage = document.getElementById("generated-image");
      const downloadButton = document.getElementById("download-button");

      displayedImage.src = imageUrl;
      downloadButton.href = imageUrl;

      displayedImage.style.display = "block";
      downloadButton.style.display = "block";
    } else {
      console.error("Failed to fetch image:", data.message);
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

async function pollStatus(requestId) {
  try {
    console.log("Polling status for request ID:", requestId); // Debugging line

    const response = await fetch(`/api/check-status?requestId=${requestId}`);
    const result = await response.json();

    if (result.status === "processing") {
      setTimeout(() => pollStatus(requestId), 1000); // Poll every second
    } else if (result.status === "success") {
      console.log("Image ready:", result.file_path);
      showImage(result.file_path);
    } else {
      console.error("Image generation failed:", result.detail);
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.innerText = "Image generation failed";
      }
    }
  } catch (error) {
    console.error("Error checking status:", error);
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.innerText = "Error checking status: " + error.message;
    }
  }
}

function showImage(filePath) {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.getElementById("content");
  const generatedImage = document.getElementById("generated-image");

  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }
  if (content) {
    content.style.display = "block";
  }
  if (generatedImage) {
    generatedImage.src = filePath;
  }
}
