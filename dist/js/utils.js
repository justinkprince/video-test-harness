const formatDisplayTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const padWithLeadingZero = (num) => (num < 10 ? "0" : "") + num;

const getTimestamp = () => {
  const date = new Date();
  const segments = [
    date.getUTCHours(),
    padWithLeadingZero(date.getUTCMinutes()),
    padWithLeadingZero(date.getUTCSeconds()),
  ];

  return `${segments.join(":")}Z`;
};

const wrapWithElement = (input, { element = "div", className = null }) => {
  const wrapper = document.createElement(element);
  wrapper.textContent = input.toString();

  if (className) {
    wrapper.classList.add(className);
  }

  return wrapper;
};

export { formatDisplayTime, padWithLeadingZero, getTimestamp, wrapWithElement };
