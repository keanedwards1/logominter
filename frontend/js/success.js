const stripe = Stripe('pk_live_51OxMMsAXpFBkWrM5X496rrJI4PzWFFW0ZAi77BLlN8VyOYJaDOKI2P3Xa1jaMiviRsFcNHdzbNt6OITW93ngAQcI00E9yQXxhL'); // Replace with your Stripe publishable key

async function fetchPaymentIntent(clientSecret) {
  console.log('Fetching payment intent for client secret:', clientSecret); // Debugging line
  try {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return null;
  }
}

async function fetchGeneratedImage(clientReferenceId) {
  try {
    const response = await fetch(`/api/get-image?file_path=${clientReferenceId}`, { method: 'GET' });
    const data = await response.json();

    if (data.status === 'success' && data.file_path) {
      const imageUrl = data.file_path;
      const displayedImage = document.getElementById('displayed-image');
      const downloadButton = document.getElementById('download-button');

      displayedImage.src = imageUrl;
      downloadButton.href = imageUrl;

      displayedImage.style.display = 'block';
      downloadButton.style.display = 'block';
    } else {
      console.error('Failed to fetch image:', data.message);
    }
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientSecret = urlParams.get('payment_intent_client_secret');

  console.log('Client secret from URL:', clientSecret); // Debugging line

  if (clientSecret) {
    const paymentIntent = await fetchPaymentIntent(clientSecret);
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      await fetchGeneratedImage(paymentIntent.client_reference_id);
    } else {
      console.error('Payment not successful:', paymentIntent);
      // Handle error or redirect to error page
    }
  } else {
    console.error('No payment_intent_client_secret found in URL.');
    // Handle error or redirect to error page
  }
});

document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('requestId');

  if (requestId) {
    await pollStatus(requestId);
  } else {
    console.error('No requestId found in URL');
  }
});

async function pollStatus(requestId) {
  try {
    const response = await fetch(`/api/check-status?requestId=${requestId}`);
    const result = await response.json();

    if (result.status === 'processing') {
      setTimeout(() => pollStatus(requestId), 1000); // Poll every 5 seconds
    } else if (result.status === 'success') {
      console.log('Image ready:', result.file_path);
      showImage(result.file_path);
    } else {
      console.error('Image generation failed');
      document.getElementById('loading-screen').innerText = 'Image generation failed';
    }
  } catch (error) {
    console.error('Error checking status:', error);
    document.getElementById('loading-screen').innerText = 'Error checking status: ' + error.message;
  }
}

function showImage(filePath) {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('content').style.display = 'block';
  document.getElementById('generated-image').src = filePath;
}