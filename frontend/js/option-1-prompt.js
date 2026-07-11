// Pub/Sub Pattern implementation for event-driven architecture
class EventEmitter {
  constructor() {
    this.events = {}; // Store event callbacks
  }

  // Register an event listener
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // Trigger an event
  emit(eventName, data) {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach(callback => callback(data));
    }
  }
}

// Manages user interface
class UIManager extends EventEmitter {
  constructor() {
    super();
    // Cache DOM elements for efficiency
    this.elements = {
      submitButton: document.getElementById('submit-button'),
      logoContainer: document.getElementById('generated-logo-container'),
      generatedLogo: document.getElementById('generated-logo'),
      downloadButton: document.getElementById('download-button'),
      statusMessage: document.getElementById('status-message')
    };
    this.bindEvents();
  }

  // Set up event listeners for UI elements
  bindEvents() {
    this.elements.submitButton.addEventListener('click', () => this.emit('submitClicked'));
    this.elements.downloadButton.addEventListener('click', () => this.emit('downloadClicked'));
  }

  // Update submit button state and text
  updateSubmitButton(isGenerating) {
    this.elements.submitButton.classList.toggle('disabled', isGenerating);
    this.elements.submitButton.querySelector('.button-top').textContent = isGenerating ? 'Generating...' : 'Submit';
  }

  // Update status message display
  updateStatusMessage(message, isError = false) {
    this.elements.statusMessage.textContent = message;
    this.elements.statusMessage.style.display = 'block';
    this.elements.statusMessage.style.color = isError ? 'red' : 'black';
    this.elements.statusMessage.style.marginTop = '20px';
  }

  // Show Lottie loader
  showLoader() {
    const lottieLoader = `
      <h3>Generating Your Logo 🚀</h3>
      <dotlottie-player 
        src="https://lottie.host/f7e3c668-4a9f-4ffd-aa03-892c525e1407/N8z3EeoIjg.json" 
        background="transparent" 
        speed="1" 
        style="width: 400px; height: 400px;" 
        loop 
        autoplay>
      </dotlottie-player>
    `;
    this.elements.logoContainer.innerHTML = lottieLoader;
    this.elements.logoContainer.style.display = 'flex'; // Show the container
  }

  // Display generated logo
  displayLogo(imageData) {
    this.elements.logoContainer.innerHTML = `
      <h3>Your Logo 🪐</h3>
      <img id="generated-logo" src="${imageData}" alt="Generated Logo">
      <div class="home-button-wrapper">
        <a id="download-button" class="button-link">
          <span class="button-top">Download</span>
        </a>
      </div>
    `;
    this.elements.logoContainer.style.display = 'flex';
    this.elements.statusMessage.style.display = 'none';
    
    // Rebind the download button event as we've recreated it
    this.elements.downloadButton = document.getElementById('download-button');
    this.elements.downloadButton.addEventListener('click', () => this.emit('downloadClicked'));
  }

  // Hide logo container
  hideLogo() {
    this.elements.logoContainer.style.display = 'none';
  }

  // Collect form values for logo generation
  getFormValues() {
    return {
      imageOf: document.querySelector('input[name="Image Of"]').value,
      background: document.querySelector('input[name="Background"]').value,
      color: document.querySelector('select[title="color"]').value,
      lighting: document.querySelector('select[title="lighting and time of day"]').value,
      style: document.querySelector('select[title="style and technique"]').value,
      artist: document.querySelector('select[title="artist"]').value
    };
  }
}

// Manages logo image data and storage
class ImageManager {
  constructor() {
    this.savedImageKey = 'savedLogoData';
  }

  // Check for a previously saved image
  checkSavedImage() {
    const savedImageData = localStorage.getItem(this.savedImageKey);
    if (savedImageData) {
      const { image, timestamp } = JSON.parse(savedImageData);
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < 3600000) { // 3600000 ms = 1 hour
        return image;
      } else {
        this.clearSavedImage();
      }
    }
    return null;
  }

  // Clear saved image data
  clearSavedImage() {
    localStorage.removeItem(this.savedImageKey);
  }

  // Save new image data
  saveImage(imageData) {
    const savedLogoData = {
      image: imageData,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(this.savedImageKey, JSON.stringify(savedLogoData));
  }

  // Get current image data (saved or from DOM)
  getCurrentImageData() {
    return this.checkSavedImage() || document.getElementById('generated-logo')?.src || null;
  }

  // Trigger image download
  triggerDownload(imageData) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `generated_logo.${this.extensionFor(imageData)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  extensionFor(imageData) {
    const mime = /^data:(image\/[^;]+)/.exec(imageData)?.[1];
    return { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/svg+xml': 'svg' }[mime] || 'png';
  }
}

// Generates prompts for logo creation
class PromptGenerator {
  generatePrompt(formValues) {
    const { imageOf, background, color, lighting, style, artist } = formValues;
    return `Imagine a simple logo using the style of vector art with a mono-colored background of ${imageOf}. In the background, there is ${background},
            with pronounced ${color}, and bathed in a beautiful ${lighting} lighting. 
            The style is reminiscent of ${style}, in the artistic style of ${artist}.`;
  }
}

// Main class orchestrating logo generation process
class LogoGenerator {
  constructor() {
    this.uiManager = new UIManager();
    this.imageManager = new ImageManager();
    this.promptGenerator = new PromptGenerator();
    this.countdownTimer = null;
    this.bindEvents();
  }

  // Bind event listeners
  bindEvents() {
    this.uiManager.on('submitClicked', () => this.generateLogo());
    this.uiManager.on('downloadClicked', () => this.downloadLogo());
  }

  // Initialize the application
  initialize() {
    const savedImage = this.imageManager.checkSavedImage();
    if (savedImage) {
      this.uiManager.displayLogo(savedImage);
    }
  }

  // Generate a new logo
  async generateLogo() {
    this.uiManager.updateSubmitButton(true);
    this.startCountdown();
    this.uiManager.showLoader();

    try {
      const formValues = this.uiManager.getFormValues();
      const prompt = this.promptGenerator.generatePrompt(formValues);
      const imageData = await this.fetchGeneratedLogo(prompt);
      this.imageManager.saveImage(imageData);
      this.uiManager.displayLogo(imageData);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.stopCountdown();
      this.uiManager.updateSubmitButton(false);
    }
  }

  // Start the countdown timer
  startCountdown() {
    let counter = 24;
    this.stopCountdown(); // Clear any existing countdown

    const updateStatusMessage = () => {
      if (counter >= 0) {
        this.uiManager.updateStatusMessage(`Estimated time to generate logo: ${counter} seconds`);
        counter--;
        this.countdownTimer = setTimeout(updateStatusMessage, 1000);
      }
    };

    updateStatusMessage();
  }

  // Stop the countdown timer
  stopCountdown() {
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  // Fetch generated logo from API
  async fetchGeneratedLogo(prompt) {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const data = await response.json();
        detail = data?.error ? ` — ${data.error}` : '';
      } catch {
        // non-JSON error body (e.g. the login page); ignore
      }
      throw new Error(`Logo generation failed (HTTP ${response.status})${detail}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Handle errors during logo generation
  handleError(error) {
    console.error('Error:', error);
    this.uiManager.updateStatusMessage('An error occurred while generating the logo. Please try again.', true);
  }

  // Download the current logo
  downloadLogo() {
    const imageData = this.imageManager.getCurrentImageData();
    if (imageData) {
      this.imageManager.triggerDownload(imageData);
    } else {
      this.uiManager.updateStatusMessage('No image available to download. Please generate a logo first.', true);
    }
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load the Lottie player script
  const script = document.createElement('script');
  script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
  script.type = "module";
  document.head.appendChild(script);

  // Initialize the LogoGenerator after ensuring the script is loaded
  script.onload = () => {
    const logoGenerator = new LogoGenerator();
    logoGenerator.initialize();
  };
});