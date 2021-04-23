/**
 * Exception handling.
 *
 * @param {string} message A human-friendly error message.
 */
const PlayerException = function (message) {
  this.message = message;
  this.name = "PlayerException";
};

export default PlayerException;
