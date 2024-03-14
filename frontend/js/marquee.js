class LogoSlider extends HTMLElement {
  
    connectedCallback() {
      this.boundUpdateVariableDuration = this.updateVariableDuration.bind(this);
      window.addEventListener('resize', this.boundUpdateVariableDuration);
      this.boundUpdateVariableDuration()
      
      Array.from(this.firstElementChild.children).forEach(child => this.firstElementChild.append(child.cloneNode(true)))
    }
  
    disconnectedCallback() {
      window.removeEventListener('resize', this.boundUpdateVariableDuration);
    }
    
    /**
    * This uses the min and max width of the logo scroller container to calculate
    * a variable duration that can be used to extend the animation of the duration
    * so that one rotation takes longer on bigger screens and shorter on small screens.
    * This might sound counter-intuitive, as you'd expect that to be the other way round,
    * however, a users field of view will change their perspective. The idea here
    * is to keep the animation scroll feeling "natural" at any screen size. 
    * @see https://www.youtube.com/watch?v=54Oy75Bnu_Q
    * At the time of writing this; the clamp, min, and max methods can't be used within an
    * animation-duration delcaration. If this was possible, no javascript would be needed at all. 
    * @example animation-duration : calc(10s + (clamp(0, (100vw - var(--min-width)) / (var(--max-width) - var(--min-width)), 1)) * 10);
    */
    updateVariableDuration() {
      this.firstElementChild.style.animation = 'initial'
      const computedStyle = getComputedStyle(this);
      const minWidth      = parseInt(computedStyle.minWidth || 320, 10);
      const maxWidth      = parseInt(computedStyle.maxWidth || 1920, 10);
      const windowWidth   = window.innerWidth 
      const normalized    = Math.min(1, Math.max(0, parseFloat(((windowWidth - minWidth) / (maxWidth - minWidth)).toFixed(2))));
      this.style.setProperty('--variable-duration', `${normalized}s`);
      setTimeout(() => {
        this.firstElementChild.style.animation = ''
      }, 500)
    }
    
  }
  
  if(!customElements.get('logo-slider')) {
    customElements.define('logo-slider', LogoSlider)
  }