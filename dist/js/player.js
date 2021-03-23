import Logger from "./logger.js";

const logger = new Logger();

/**
 * Exception handling.
 *
 * @param {string} message A human-friendly error message.
 */
const PlayerException = function (message) {
  this.message = message;
  this.name = "PlayerException";
};

/**
 * Nearly all the states the player could be in.
 */
export const PLAYER_STATE = {
  PLAYING: "playing",
  PAUSED: "paused",
  STOPPED: "stopped",
  FAST_FORWARD: "fast_forward",
  REWIND: "rewind",
};

/**
 * Events which can be observed and reacted upon.
 */
export const PLAYER_EVENT = {
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

const STEP_DIRECTION = {
  FORWARD: "FORWARD",
  BACKWARD: "BACKWARD",
};

/** Wrapper over the native HTMLVideoElement, providing a few convenience methods. */
class Player {
  /**
   * Bootstrap the Player.
   *
   * @param {HTMLVideoElement} videoElement Node which will play the media.
   * @param {Object} options Allows for named arguments via destructuring.
   * @param {number} options.seekStepSeconds How many seconds to skip forward during seek operations.
   */
  constructor(videoElement, { seekStepSeconds = 2 } = {}) {
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new PlayerException("Invalid video element.");
    }

    this.state = PLAYER_STATE.STOPPED;
    this.seekStepSeconds = seekStepSeconds;

    this.observers = {};
    this.interval;

    this.media = videoElement;
  }

  /**
   * Convenience property to provide a more consistant API.
   */
  get paused() {
    return this.media.paused;
  }

  /**
   * Using a custom playing property so it's sure to be in sync with internal state.
   */
  get playing() {
    return this.state === PLAYER_STATE.PLAYING;
  }

  /**
   * "seeking" state is TRUE if the player is either fast forwarding or rewinding.
   */
  get seeking() {
    return [PLAYER_STATE.FAST_FORWARD, PLAYER_STATE.REWIND].includes(
      this.state
    );
  }

  /**
   * @param {string} url A video URL to play.
   */
  load(url) {
    logger.log(`NativePlayer.play(${url})`);
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
  notify(event) {
    logger.log(`Event '${event}' fired`);
    if (event in this.observers) {
      this.observers[event].forEach((callback) => callback(event));
    }

    if ("*" in this.observers) {
      this.observers["*"].forEach((callback) => callback(event));
    }
  }

  /**
   * Play the video, update the state, and broadcast the event.
   */
  play() {
    logger.log("NativePlayer.play()");
    clearInterval(this.interval);
    this.media.play();
    this.state = PLAYER_STATE.PLAYING;
    this.notify(PLAYER_EVENT.PLAY);
  }

  /**
   * Pause the video, update the state, and broadcast the event.
   */
  pause() {
    logger.log("NativePlayer.pause()");
    clearInterval(this.interval);
    this.media.pause();
    this.state = PLAYER_STATE.PAUSED;
    this.notify(PLAYER_EVENT.PAUSE);
  }

  /**
   * Stop the video, reset the head, update the state, and broadcast the event.
   */
  stop() {
    logger.log("NativePlayer.play()");
    clearInterval(this.interval);
    this.media.pause();
    this.media.currentTime = 0;
    this.state = PLAYER_STATE.STOPPED;
    this.notify(PLAYER_EVENT.STOP);
  }

  /**
   * Set the fast forwarding state either on or off, activating an interval that
   * moves the head forward incrementally.
   */
  fastForward() {
    logger.log("NativePlayer.fastForward()");
    clearInterval(this.interval);
    this.notify(PLAYER_EVENT.FAST_FORWARD);

    if (this.state === PLAYER_STATE.FAST_FORWARD) {
      this.state = PLAYER_STATE.PLAYING;
      clearInterval(this.interval);
      this.media.play();
    } else {
      this.state = PLAYER_STATE.FAST_FORWARD;
      this.media.pause();
      this.interval = setInterval(
        this.step.bind(this, STEP_DIRECTION.FORWARD),
        500
      );
    }
  }

  /**
   * Set the rewinding state either on or off, activating an interval that
   * moves the head backward incrementally.
   */
  rewind() {
    logger.log("NativePlayer.rewind()");
    clearInterval(this.interval);
    this.notify(PLAYER_EVENT.REWIND);

    if (this.state === PLAYER_STATE.REWIND) {
      this.state = PLAYER_STATE.PLAYING;
      clearInterval(this.interval);
      this.media.play();
    } else {
      this.state = PLAYER_STATE.REWIND;
      this.media.pause();
      this.interval = setInterval(
        this.step.bind(this, STEP_DIRECTION.BACKWARD),
        500
      );
    }
  }

  /**
   * Move forward/backward by the set amount of seconds unless the head is at the beginning/end.
   */
  step(direction) {
    const directionModifier = direction === STEP_DIRECTION.BACKWARD ? -1 : 1;
    const targetTime =
      this.media.currentTime + this.seekStepSeconds * directionModifier;
    const isOutOfBounds = targetTime >= this.media.duration || targetTime <= 0;

    if (isOutOfBounds) {
      this.state = PLAYER_STATE.STOPPED;
      clearInterval(this.interval);
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
    logger.log(`NativePlayer.seek(${seconds})`);
    clearInterval(this.interval);
    this.notify(PLAYER_EVENT.SEEK);

    if (this.media.duration > seconds) {
      this.media.currentTime = seconds;
      if (this.state === PLAYER_STATE.PLAYING) {
        this.media.play();
      } else {
        this.media.pause();
      }
    }
  }
}

export default Player;
