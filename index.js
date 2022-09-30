import { setBubble, refreshBubbleInfo, showNotification, buttonStatus, downloadFile } from './helpers.js';

(() => {
  const inputRanges = document.querySelectorAll(".range-wrap");
  const preview = document.querySelector('#preview');
  const iFilename = document.querySelector('#filename');

  const data = {
    capture: false,
    stream: null,
    buffer: [],
    iMediaRecorder: null,
    width: 0,
    height: 0,
  }

  document.querySelector('#capture').addEventListener('click', async function() {
    try {
      if (!iFilename.value.length) {
        throw 'Filename is required';
      }
      data.capture = !data.capture;
      if (data.capture) {
        const config = {
          video: {
            cursor: 'always',
            mandatory: {
              maxWidth: data.width,
              maxHeight: data.height
            }
          },
          audio: true
        };
        data.buffer = [];
        data.stream = await navigator.mediaDevices.getDisplayMedia(config);
        preview.srcObject = data.stream;
        if (data.stream) {
          if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            throw 'No video format support';
          }
          data.iMediaRecorder = new MediaRecorder(data.stream, { mimeType: 'video/webm;codecs=vp8' });
          data.iMediaRecorder.ondataavailable = evt => evt && evt.data && evt.data.size > 0 && data.buffer.push(evt.data);
          data.iMediaRecorder.onstop = () => {
            data.capture = !data.capture;
            data.stream && buttonStatus.call(this, data);
            stopStream(data);
          }
          data.iMediaRecorder.start(10);
        } else {
          throw `There aren't data to save`;
        }
      } else {
        stopStream(data);
      }
    } catch (err) {
      showNotification({
        message: err,
        type: 'error',
        timeout: 3000
      });
    } finally {
      buttonStatus.call(this, data);
    }
  });
  
  const stopStream = (data) => {
    if (data.stream) {
      let tracks = preview.srcObject?.getTracks?.();
      tracks.forEach(track => track.stop())
      preview.srcObject = null
    }
    if (data.iMediaRecorder){
      data.iMediaRecorder = null;
      downloadFile({ buffer: data.buffer, filename: iFilename.value });
      Object.assign(data, { stream: null, iMediaRecorder: null });
    }
  };

  inputRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");
    const { value, left } = setBubble.call(range);
    data[range.id] = range.value;
    refreshBubbleInfo.call(bubble, { value, left });

    range.addEventListener("input", function() {
      const { value, left } = setBubble.call(range);
      data[this.id] = range.value;
      refreshBubbleInfo.call(bubble, { value, left });
    });
  });

})();