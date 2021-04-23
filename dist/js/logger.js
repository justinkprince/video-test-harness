import { getTimestamp, wrapWithElement } from "./utils.js";

const prepareInput = (input, className = null) => {
  return wrapWithElement(`${getTimestamp()} - ${input}`, { className });
};

const Logger = function () {
  const log = document.getElementById("log");

  return {
    log: (input) => log.prepend(prepareInput(input)),
    error: (input) => log.prepend(prepareInput(input, "error")),
    clear: () => (log.innerHTML = prepareInput("Log cleared")),
  };
};

export default Logger;
