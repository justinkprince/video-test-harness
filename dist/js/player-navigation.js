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
    this.navContainer = document.getElementById("nav-streams");
  }

  /**
   * Given some text and a callback, create a simple button with an event handler.
   *
   * @param {Object} obj Allows for named arguments via destructuring.
   * @param {string} obj.label The button text.
   * @param {callback} obj.handleClick Event handler for the button.
   */
  addStreamButton({ label, handleClick, isActive = false }) {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-stream");
    button.innerText = label;
    button.addEventListener("click", () => {
      this.deactivateAllButtons();
      handleClick();
      button.classList.add("active");
    });

    if (isActive) {
      button.classList.add("active");
    }

    this.navContainer.appendChild(button);
  }

  deactivateAllButtons() {
    this.navContainer.querySelectorAll(".btn-stream").forEach((button) => {
      button.classList.remove("active");
    });
  }

  /**
   * Clear out all content from the container.
   */
  clear() {
    this.navContainer.innerHTML = "";
  }
}

export default PlayerNavigation;
