const stripe = Stripe('pk_live_51OxMMsAXpFBkWrM5X496rrJI4PzWFFW0ZAi77BLlN8VyOYJaDOKI2P3Xa1jaMiviRsFcNHdzbNt6OITW93ngAQcI00E9yQXxhL'); // Replace with your Stripe publishable key

async function fetchPaymentIntent(clientSecret) {
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
