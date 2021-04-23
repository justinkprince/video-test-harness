import PlayerException from "./player-exception.js";

/** Wrapper over the native HTMLVideoElement, providing a few convenience methods. */
class Player {
  static get EVENTS() {
    return {
      READY: "ready",
      ERROR: "error",
      COMPLETE: "complete",
      MUTE: "mute",
      PLAY: "play",
      PAUSE: "pause",
      STOP: "stop",
      FAST_FORWARD: "fast_forward",
      REWIND: "rewind",
      SEEK: "seek",
    };
  }

  static get STATES() {
    return {
      PLAYING: "playing",
      PAUSED: "paused",
      STOPPED: "stopped",
      FAST_FORWARD: "fast_forward",
      REWIND: "rewind",
    };
  }

  static get STEP_DIRECTION() {
    return {
      FORWARD: "FORWARD",
      BACKWARD: "BACKWARD",
    };
  }

  /**
   * Bootstrap the Player.
   *
   * @param {HTMLVideoElement} videoElement Node which will play the media.
   * @param {Object} options Allows for named arguments via destructuring.
   * @param {number} options.seekStepSeconds How many seconds to skip forward during seek operations.
   */
  constructor(videoElement, { seekStepSeconds = 2, logger = null } = {}) {
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new PlayerException("Invalid video element.");
    }

    this.logger = logger ?? { log: () => {} };

    this.media = videoElement;

    this.state = Player.STATES.STOPPED;
    this.seekStepSeconds = seekStepSeconds;

    this.observers = {};
    this.seekInterval = null;
  }

  /**
   * Convenience method to provide a more consistant API.
   */
  get paused() {
    return this.media.paused;
  }

  /**
   * Using a custom playing property so it's sure to be in sync with internal state.
   */
  get playing() {
    return this.state === Player.STATES.PLAYING;
  }

  /**
   * "seeking" state is TRUE if the player is either fast forwarding or rewinding.
   */
  get seeking() {
    return [Player.STATES.FAST_FORWARD, Player.STATES.REWIND].includes(
      this.state
    );
  }

  /**
   * @param {string} url A video URL to play.
   */
  load(url) {
    this.stop();
    this.logger.log(`Player.load(${url})`);
    this.media.src = url;
  }

  /**
   * @param {string} event Name of some event to respond to.
   * @param {callback} callback Called when the event has been triggered.
   */
  addObserver(event, callback) {
    if (!Array.isArray(event)) {
      event = [event];
    }

    event.forEach((e) => {
      this.observers[e] = this.observers[e] ?? [];
      this.observers[e].push(callback);
    });
  }

  /**
   * @param {string} event When an event has been triggered, call each observers' callback.
   */
  notify(event, data = null) {
    this.logger.log(`Event '${event}' fired`);
    if (event in this.observers) {
      this.observers[event].forEach((callback) => callback(event, data));
    }

    if ("*" in this.observers) {
      this.observers["*"].forEach((callback) => callback(event, data));
    }
  }

  /**
   * Play the video, update the state, and broadcast the event.
   */
  play() {
    this.logger.log("Player.play()");
    clearInterval(this.seekInterval);
    this.media.play();
    this.state = Player.STATES.PLAYING;
    this.notify(Player.EVENTS.PLAY);
  }

  /**
   * Pause the video, update the state, and broadcast the event.
   */
  pause() {
    this.logger.log("Player.pause()");
    clearInterval(this.seekInterval);
    this.media.pause();
    this.state = Player.STATES.PAUSED;
    this.notify(Player.EVENTS.PAUSE);
  }

  /**
   * Stop the video, reset the head, update the state, and broadcast the event.
   */
  stop() {
    this.logger.log("Player.stop()");
    clearInterval(this.seekInterval);
    this.media.pause();
    this.media.currentTime = 0;
    this.state = Player.STATES.STOPPED;
    this.notify(Player.EVENTS.STOP);
  }

  /**
   * Set the fast forwarding state either on or off, activating an interval that
   * moves the head forward incrementally.
   */
  fastForward() {
    clearInterval(this.seekInterval);

    if (this.state === Player.STATES.FAST_FORWARD) {
      this.state = Player.STATES.PLAYING;
      clearInterval(this.seekInterval);
      this.media.play();
      this.logger.log(`${Player.EVENTS.FAST_FORWARD} on`);
    } else {
      this.state = Player.STATES.FAST_FORWARD;
      this.media.pause();
      this.seekInterval = setInterval(
        this.step.bind(this, Player.STEP_DIRECTION.FORWARD),
        500
      );
      this.logger.log(`${Player.EVENTS.FAST_FORWARD} off`);
    }

    this.notify(Player.EVENTS.FAST_FORWARD);
  }

  /**
   * Set the rewinding state either on or off, activating an interval that
   * moves the head backward incrementally.
   */
  rewind() {
    clearInterval(this.seekInterval);

    if (this.state === Player.STATES.REWIND) {
      this.state = Player.STATES.PLAYING;
      clearInterval(this.seekInterval);
      this.media.play();
      this.logger.log(`${Player.EVENTS.REWIND} on`);
    } else {
      this.state = Player.STATES.REWIND;
      this.media.pause();
      this.seekInterval = setInterval(
        this.step.bind(this, Player.STEP_DIRECTION.BACKWARD),
        500
      );
      this.logger.log(`${Player.EVENTS.REWIND} off`);
    }

    this.notify(Player.EVENTS.REWIND);
  }

  /**
   * Move forward/backward by the set amount of seconds unless the head is at the beginning/end.
   */
  step(direction) {
    const directionModifier =
      direction === Player.STEP_DIRECTION.BACKWARD ? -1 : 1;
    const targetTime =
      this.media.currentTime + this.seekStepSeconds * directionModifier;
    const isOutOfBounds = targetTime >= this.media.duration || targetTime <= 0;

    if (isOutOfBounds) {
      this.state = Player.STATES.STOPPED;
      clearInterval(this.seekInterval);
      this.stop();
    } else {
      this.media.currentTime += this.seekStepSeconds * directionModifier;
    }
  }

  /**
   * Jump to a specific point in playback.
   *
   * @param {number} seconds Number of seconds within the playback's duration to jump to.
   */
  seek(seconds) {
    this.logger.log(`${Player.EVENTS.SEEK} ${seconds} seconds`);
    clearInterval(this.seekInterval);

    if (this.media.duration > seconds) {
      this.media.currentTime = seconds;
      if (this.state === Player.STATES.PLAYING) {
        this.media.play();
      } else {
        this.media.pause();
      }
      this.notify(Player.EVENTS.SEEK);
    }
  }
}

export default Player;
