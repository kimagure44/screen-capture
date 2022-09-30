export const setBubble = function () {
  const val = this.value;
  const min = this.min ? this.min : 0;
  const max = this.max ? this.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min)) - 135;
  return {
    value: val,
    left: `calc(${newVal}% + (${8 - newVal * 0.61}px))`,
  };
};

export const refreshBubbleInfo = function ({ value, left }) {
  this.innerHTML = value;
  this.style.left = left;
};

export const showNotification = ({ message = '', timeout = 2000, type = 'neutral' }) => {
  const notification = document.querySelector('#notification');
  notification.classList.add('show', type);
  notification.innerHTML = message;
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.innerHTML = '';
      notification.classList.remove(type);
    }, 300);
  }, timeout);
};

export const downloadFile = ({ buffer, filename }) => {
  try {
    if (!buffer.length) {
      throw 'Not recording anything'
    }
    const blob = new Blob(buffer, { type: 'video/MP4'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    a.download = `${filename}.mp4`;
    a.click();
  } catch(err) {
    throw err;
  }
};

export const buttonStatus = function(data) {
  this.classList[data.capture ? 'add' : 'remove']('stop');
  this.classList[data.capture ? 'remove' : 'add']('start');
  this.innerHTML = `${data.capture ? 'Stop' : 'Start'} capture`;
};