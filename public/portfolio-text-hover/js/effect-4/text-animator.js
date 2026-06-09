// Import the TextSplitter class for handling text splitting.
import { TextSplitter } from '../textSplitter.js';

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const SCRAMBLE_COLOR = '#8a8a8a';
const FINAL_COLOR = '#111';

// Defines a class to create hover effects on text.
export class TextAnimator {
  constructor(textElement) {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.originalChars = []; // Store the original characters
    this.splitText();
  }

  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
  }

  animate() {
    // Reset any ongoing animations
    this.reset();

    // Query all individual characters in the line for animation.
    const chars = this.splitter.getChars();

    gsap.set(chars, { color: SCRAMBLE_COLOR });

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;

      gsap.fromTo(char, {
        opacity: 0
      },
      {
        duration: 0.03,
        onComplete: () => gsap.set(char, { innerHTML: initialHTML, color: FINAL_COLOR }),
        repeat: 2,
        repeatRefresh: true,
        repeatDelay: 0.05,
        delay: (position + 1) * 0.06,
        innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
        opacity: 1,
        color: SCRAMBLE_COLOR,
      });
    });
  }

  animateBack() {
    const chars = this.splitter.getChars();
    gsap.killTweensOf(chars);
    gsap.killTweensOf(this.textElement);
    gsap.set(chars, { color: FINAL_COLOR });
  }

  reset() {
    // Reset the text to its original state
    const chars = this.splitter.getChars();
    chars.forEach((char, index) => {
      gsap.killTweensOf(char); // Ensure no ongoing animations
      char.innerHTML = this.originalChars[index];
      gsap.set(char, { color: FINAL_COLOR });
    });

    gsap.killTweensOf(this.textElement);
  }
}
