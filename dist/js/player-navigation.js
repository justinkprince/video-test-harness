/** Allows users to select a video to load and play in the Player. */
class PlayerNavigation {
  /**
   * Bootstrap the navigation component.
   */
  constructor() {
    this.selectElements();
  }

  /**
   * This container is just a wrapper to simply hold buttons.
   */
  selectElements() {
    this.navContainer = document.getElementById('nav-streams');
  }

  /**
   * Given some text and a callback, create a simple button with an event handler.
   *
   * @param {Object} obj Allows for named arguments via destructuring.
   * @param {string} obj.label The button text.
   * @param {callback} obj.handleClick Event handler for the button.
   */
  addStreamButton({ label, handleClick }) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-stream');
    button.innerText = label;
    button.addEventListener('click', handleClick);

    this.navContainer.appendChild(button);
  }

  /**
   * Clear out all content from the container.
   */
  clear() {
    this.navContainer.innerHTML = '';
  }
}

export default PlayerNavigation;
