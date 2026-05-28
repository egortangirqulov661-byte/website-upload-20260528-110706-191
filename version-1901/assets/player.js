(function () {
  const ready = function (callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  ready(function () {
    const players = Array.from(document.querySelectorAll('[data-player]'));

    players.forEach(function (box) {
      const video = box.querySelector('video');
      const cover = box.querySelector('[data-play-cover]');
      const stream = box.getAttribute('data-stream');
      let hls = null;
      let prepared = false;

      const prepare = function () {
        if (!video || !stream || prepared) {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }

        prepared = true;
      };

      const start = function () {
        prepare();

        if (!video) {
          return;
        }

        if (cover) {
          cover.classList.add('is-hidden');
        }

        video.controls = true;
        const action = video.play();

        if (action && typeof action.catch === 'function') {
          action.catch(function () {
            if (cover) {
              cover.classList.remove('is-hidden');
            }
          });
        }
      };

      if (cover) {
        cover.addEventListener('click', start);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            start();
          }
        });

        video.addEventListener('play', function () {
          if (cover) {
            cover.classList.add('is-hidden');
          }
        });

        video.addEventListener('ended', function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
