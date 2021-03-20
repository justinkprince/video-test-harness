const convertSecondsToMinutes = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const padWithZero = (num) => (num < 10 ? '0' : '') + num;

const getTimestamp = () => {
  const date = new Date();
  const segments = [
    date.getUTCHours(),
    padWithZero(date.getUTCMinutes()),
    padWithZero(date.getUTCSeconds()),
  ];

  return `${segments.join(':')}Z`;
};

const wrapWithDiv = (input, className = null) => {
  const wrapper = document.createElement('div');
  wrapper.textContent = `${getTimestamp()} - ${input.toString()}`;

  if (className) {
    wrapper.classList.add(className);
  }

  return wrapper;
};

export { convertSecondsToMinutes, padWithZero, getTimestamp, wrapWithDiv };
