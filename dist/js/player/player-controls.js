import { formatDisplayTime } from "../utils.js";

/** Provides all the interactivity for the Player */
class PlayerControls {
  /**
   * Bootstrap all the control elements and wire up their event handles that
   * interface with the Player.
   *
   * @param {Player} player Wrapper for the HTMLVideoElement.
   * @param {HTMLVideoElement} container DOM node that houses all the controls.
   */
  constructor(player, container) {
    this.player = player;
    this.container = container;
    this.currentTimeInterval;

    this.selectElements();
    this.addButtonEvents();
    this.addSeekEvents();
    this.addObservers();
    this.addTimers();
  }

  /**
   * Enable and disable all controls.
   * @param {boolean} isEnabled Add or remove `disabled` attribute from form elements.
   */
  setEnabled(isEnabled) {
    this.container.querySelectorAll(".control").forEach((control) => {
      control.disabled = !isEnabled;
    });
  }

  /**
   * Select and store all the control elements.
   * Refactoring this class could allow for the elements to be passed in explicitly.
   */
  selectElements() {
    const container = this.container;

    this.playPauseBtn = container.querySelector(".btn-play-pause");
    this.fastForwardBtn = container.querySelector(".btn-fast-forward");
    this.rewindBtn = container.querySelector(".btn-rewind");
    this.seekForm = container.querySelector(".video-controls-form");
    this.seekManualInput = container.querySelector(".input-seek-manual");
    this.seekScrubberInput = container.querySelector(".input-seek-scrubber");
    this.displayTime = document.getElementById("video-time");
  }

  /**
   * For the main control buttons, add event handlers that utilize the Player's API.
   */
  addButtonEvents() {
    this.playPauseBtn.addEventListener("click", () => {
      if (this.player.playing) {
        this.player.pause();
      } else {
        this.player.play();
      }
    });

    this.fastForwardBtn.addEventListener("click", () => {
      this.player.fastForward();
    });

    this.rewindBtn.addEventListener("click", () => {
      this.player.rewind();
    });
  }

  /**
   * Add all of the handlers responsible for the seek functionality.
   */
  addSeekEvents() {
    // A form wraps the manual seek input field so that onEnter events
    // trigger this event handler out of convenience.
    this.seekForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.player.seek(this.seekManualInput.value);
    });

    this.seekManualInput.addEventListener("click", (e) => {
      this.seekManualInput.select();
    });

    // The scrubber acts as a secondary seek control.
    this.seekScrubberInput.addEventListener("change", (e) => {
      this.player.seek(e.target.value);
    });

    // Prevent seeking beyond the duration of the video content.
    this.player.media.addEventListener("durationchange", (e) => {
      const duration = Math.floor(e.target.duration);
      this.seekManualInput.max = duration;
      this.seekScrubberInput.max = duration;
    });
  }

  /**
   * Update the play/pause button display on any state changes.
   */
  addObservers() {
    this.player.addObserver("*", () => {
      if (this.player.playing) {
        this.playPauseBtn.classList.add("playing");
      } else {
        this.playPauseBtn.classList.remove("playing");
      }
    });
  }

  /**
   * To keep the displayed time and the scrubber position in sync with the
   * content playback progression, we poll the player.
   *
   * NOTE: setInterval is not great for use as a timer but it works here
   * because the time values are not dependent on that function but rather the
   * duration and currentTime values on the HTMLMediaElement which should be
   * accurate.
   */
  addTimers() {
    // Poll the currentTime property to update the scrubber position.
    this.currentTimeInterval = setInterval(() => {
      this.seekScrubberInput.value = this.player.media.currentTime;
      this.displayTime.innerText = this.getDisplayTime();
    }, 1000);
  }

  /**
   * Converts seconds for both the time elapsed and total duration time, formatted nicely.
   * @returns {string} Formatted time string.
   */
  getDisplayTime() {
    const media = this.player.media;
    let time = "00:00 / 00:00";
    let duration = !Number.isNaN(media.duration) ? media.duration : null;

    if (duration) {
      const currentTime = formatDisplayTime(media.currentTime);
      duration = formatDisplayTime(duration);
      time = `${currentTime} / ${duration}`;
    }

    return time;
  }
}

export default PlayerControls;
