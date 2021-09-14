const TAG = '[audio]';
let audioEl = null;
let oldResolve = null;

function play(src) {
  return new Promise(resolve => {
    if (!audioEl) {
      createAudio();
    }
    resolveOldPromise();
    oldResolve = resolve;
    audioEl.onended = function() {
      console.warn(TAG, 'onended');
      resolve();
      oldResolve = null;
    };
    audioEl.onerror = function() {
      console.warn(TAG, 'onerror');
      resolve();
      oldResolve = null;
    };
    audioEl.src = src;
    audioEl.play();
    console.warn(TAG, 'play()', src);
  });
}

function stop() {
  if (audioEl) {
    console.warn(TAG, 'stop()');
    audioEl.src = '';
    resolveOldPromise();
    return audioEl.pause();
  }
}

function createAudio() {
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.hidden = 'true';
    document.body.appendChild(audioEl);
  }
}

function resolveOldPromise() {
  if (oldResolve) {
    oldResolve();
    oldResolve = null;
  }
}

export default {
  play,
  stop
};
